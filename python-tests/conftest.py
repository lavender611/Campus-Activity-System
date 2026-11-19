"""pytest 共享夹具与后端生命周期管理。

设计目标：
1. 开箱即用：不传任何参数时，如果 8080 上没有服务，会自动启动 ``backend/target`` 下的 jar，
   跑完再关掉；如果后端已经在 IDEA 里运行，则直接复用，不会重复启动。
2. 数据自洽：每个用例通过 ``activity_factory`` 自建活动，结束后删除（报名记录随活动级联删除），
   不在共享数据库里留下垃圾数据。
3. 用户 ID 不写死：通过登录接口解析真实 ID，数据库重新导入后依然可用。
"""

from __future__ import annotations

import os
import re
import shutil
import socket
import subprocess
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import pytest
import requests

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_JAR = PROJECT_ROOT / "backend" / "target" / "campus-activity-1.0.0.jar"
REPORT_DIR = Path(__file__).resolve().parent / "reports"
BACKEND_LOG = REPORT_DIR / "backend.log"

DEFAULT_BASE_URL = "http://127.0.0.1:8080"
REQUEST_TIMEOUT = 10
STARTUP_TIMEOUT = 90

# 演示账号（见 database/campus_activity.sql）
DEMO_PASSWORD = "123456"
DEMO_ACCOUNTS = {"student01": "STUDENT", "student02": "STUDENT", "admin": "ADMIN"}

ISO_DATETIME = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")


# --------------------------------------------------------------------------- #
# HTTP 客户端
# --------------------------------------------------------------------------- #
class ApiClient:
    """对 requests.Session 的薄封装，统一 base 路径与超时。"""

    def __init__(self, base_url: str) -> None:
        self.root = base_url.rstrip("/")
        self.base = f"{self.root}/api"
        self.session = requests.Session()
        self.session.headers.update({"Accept": "application/json"})

    def request(self, method: str, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", REQUEST_TIMEOUT)
        return self.session.request(method, f"{self.base}{path}", **kwargs)

    def get(self, path: str, **kwargs) -> requests.Response:
        return self.request("GET", path, **kwargs)

    def post(self, path: str, **kwargs) -> requests.Response:
        return self.request("POST", path, **kwargs)

    def put(self, path: str, **kwargs) -> requests.Response:
        return self.request("PUT", path, **kwargs)

    def delete(self, path: str, **kwargs) -> requests.Response:
        return self.request("DELETE", path, **kwargs)

    @staticmethod
    def body(response: requests.Response) -> dict:
        """尽力解析 JSON，解析失败返回空字典，方便断言报错信息。"""
        try:
            data = response.json()
            return data if isinstance(data, dict) else {"_list": data}
        except ValueError:
            return {}


# --------------------------------------------------------------------------- #
# 后端启动辅助
# --------------------------------------------------------------------------- #
def _java_binary() -> str:
    java_home = os.environ.get("JAVA_HOME")
    if java_home:
        candidate = Path(java_home) / "bin" / ("java.exe" if os.name == "nt" else "java")
        if candidate.exists():
            return str(candidate)
    found = shutil.which("java")
    if not found:
        pytest.exit("未找到 java，请安装 JDK 21 或设置 JAVA_HOME", returncode=1)
    return found


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def _is_up(base_url: str) -> bool:
    try:
        response = requests.get(f"{base_url}/api/activities", timeout=3)
        return response.status_code == 200
    except requests.RequestException:
        return False


def _wait_ready(base_url: str, process: subprocess.Popen | None = None) -> tuple[bool, str]:
    deadline = time.time() + STARTUP_TIMEOUT
    last = "无响应"
    while time.time() < deadline:
        if process is not None and process.poll() is not None:
            return False, f"后端进程已退出，退出码 {process.returncode}"
        try:
            response = requests.get(f"{base_url}/api/activities", timeout=3)
            last = f"HTTP {response.status_code}"
            if response.status_code == 200:
                return True, ""
        except requests.RequestException as exc:
            last = type(exc).__name__
        time.sleep(0.5)
    return False, f"等待超时（最后状态：{last}）"


def _tail(path: Path, lines: int = 40) -> str:
    try:
        content = path.read_text(encoding="utf-8", errors="replace").splitlines()
        return "\n".join(content[-lines:])
    except OSError:
        return "(无日志)"


def _say(config: pytest.Config, message: str) -> None:
    """直接输出到终端，避免被 pytest 的 stdout 捕获吞掉。"""
    reporter = config.pluginmanager.get_plugin("terminalreporter")
    if reporter is not None:
        reporter.write_line(message)
    else:
        print(message)


def pytest_addoption(parser: pytest.Parser) -> None:
    group = parser.getgroup("campus")
    group.addoption(
        "--base-url",
        dest="base_url",
        default=None,
        help="被测后端地址，例如 http://127.0.0.1:8080（默认自动探测/启动）",
    )
    group.addoption(
        "--no-autostart",
        dest="no_autostart",
        action="store_true",
        default=False,
        help="不自动启动后端；后端未运行时跳过测试",
    )


# --------------------------------------------------------------------------- #
# 夹具
# --------------------------------------------------------------------------- #
@pytest.fixture(scope="session")
def base_url(request: pytest.FixtureRequest) -> str:
    cli_url = request.config.getoption("base_url")
    url = (cli_url or os.environ.get("API_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")

    if _is_up(url):
        _say(request.config, f"[conftest] 复用已运行的后端：{url}")
        yield url
        return

    if request.config.getoption("no_autostart"):
        pytest.skip(f"后端未运行且指定了 --no-autostart：{url}")

    if not BACKEND_JAR.exists():
        pytest.fail(
            f"未找到后端 jar：{BACKEND_JAR}\n"
            "请先构建：mvn -f backend/pom.xml -DskipTests package"
        )

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    port = _free_port()
    target = f"http://127.0.0.1:{port}"
    _say(request.config, f"[conftest] 启动后端：{BACKEND_JAR.name} (port {port})")

    with BACKEND_LOG.open("w", encoding="utf-8") as log_file:
        process = subprocess.Popen(
            [
                _java_binary(),
                "-jar",
                str(BACKEND_JAR),
                f"--server.port={port}",
                "--spring.main.banner-mode=off",
            ],
            cwd=str(PROJECT_ROOT),
            stdout=log_file,
            stderr=subprocess.STDOUT,
        )

    ready, reason = _wait_ready(target, process)
    if not ready:
        if process.poll() is None:
            process.kill()
            process.wait(timeout=10)
        pytest.fail(
            f"后端启动失败：{reason}\n"
            f"日志文件：{BACKEND_LOG}\n"
            f"----- 日志末尾 -----\n{_tail(BACKEND_LOG)}"
        )

    yield target

    process.terminate()
    try:
        process.wait(timeout=15)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=10)


@pytest.fixture(scope="session")
def api(base_url: str) -> ApiClient:
    return ApiClient(base_url)


@pytest.fixture(scope="session")
def users(api: ApiClient) -> dict:
    """通过登录接口解析演示账号的真实用户信息（不写死 ID）。"""
    resolved = {}
    for username, expected_role in DEMO_ACCOUNTS.items():
        response = api.post("/users/login", json={"username": username, "password": DEMO_PASSWORD})
        assert response.status_code == 200, f"登录接口异常：{response.status_code} {response.text}"
        payload = response.json()
        assert payload.get("success") is True, f"演示账号 {username} 登录失败：{payload}"
        assert payload["user"]["role"] == expected_role
        resolved[username] = payload["user"]
    return resolved


def build_activity_payload(**overrides) -> dict:
    """生成一份合法的活动请求体，可按需覆盖字段。"""
    start = datetime.now() + timedelta(days=30)
    payload = {
        "title": f"自动化测试-{uuid.uuid4().hex[:8]}",
        "description": "pytest 自动创建，跑完自动删除",
        "category": "学术讲座",
        "location": "自动化测试地点",
        "startTime": start.strftime("%Y-%m-%dT%H:%M:%S"),
        "endTime": (start + timedelta(hours=3)).strftime("%Y-%m-%dT%H:%M:%S"),
        "capacity": 30,
    }
    payload.update(overrides)
    return payload


@pytest.fixture
def activity_payload():
    """返回 payload 构造函数，供校验类用例构造非法数据。"""
    return build_activity_payload


@pytest.fixture
def activity_factory(api: ApiClient, activity_payload):
    """创建测试活动，用例结束后删除（报名记录由后端级联删除）。"""
    created: list[int] = []

    def _create(**overrides) -> int:
        response = api.post("/activities", json=activity_payload(**overrides))
        assert response.status_code == 200, f"创建活动失败：{response.status_code} {response.text}"
        body = response.json()
        assert body.get("success") is True, f"创建活动失败：{body}"
        created.append(body["id"])
        return body["id"]

    yield _create

    for activity_id in created:
        try:
            api.delete(f"/activities/{activity_id}")
        except requests.RequestException:
            pass
