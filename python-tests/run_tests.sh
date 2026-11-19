#!/usr/bin/env bash
# 一键运行 Python 接口自动化测试（macOS / Linux / Git Bash）
# 用法：
#   ./run_tests.sh                       # 全量运行，生成 HTML 报告
#   ./run_tests.sh -m smoke              # 只跑冒烟用例
#   ./run_tests.sh --base-url http://127.0.0.1:8080

set -euo pipefail
cd "$(dirname "$0")"

if [ ! -x ".venv/bin/python" ]; then
    echo "[setup] 创建虚拟环境 .venv ..."
    python3 -m venv .venv
fi

echo "[setup] 检查依赖 ..."
.venv/bin/python -m pip install --quiet --disable-pip-version-check -r requirements.txt

export PYTHONIOENCODING=utf-8
mkdir -p reports

set +e
.venv/bin/python -m pytest --html=reports/report.html --self-contained-html "$@"
code=$?
set -e

if [ "$code" -eq 0 ]; then
    echo "[ok] 全部用例通过，报告：reports/report.html"
else
    echo "[fail] 存在失败用例（退出码 $code），报告：reports/report.html"
fi
exit "$code"
