"""登录接口：成功、失败、密码不泄漏、畸形请求。"""

import pytest

VALID_USERNAME = "student01"
VALID_PASSWORD = "123456"


@pytest.mark.smoke
@pytest.mark.parametrize(
    ("username", "expected_role"),
    [("student01", "STUDENT"), ("student02", "STUDENT"), ("admin", "ADMIN")],
)
def test_login_success(api, username, expected_role):
    response = api.post("/users/login", json={"username": username, "password": VALID_PASSWORD})
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["message"] == "登录成功"
    assert body["user"]["username"] == username
    assert body["user"]["role"] == expected_role
    assert isinstance(body["user"]["id"], int)


def test_login_does_not_leak_password(api):
    body = api.post(
        "/users/login", json={"username": VALID_USERNAME, "password": VALID_PASSWORD}
    ).json()
    assert body["user"].get("password") in (None, ""), "登录响应不应携带密码"


@pytest.mark.parametrize(
    "payload",
    [
        {"username": VALID_USERNAME, "password": "wrong-password"},
        {"username": "not-exist-user", "password": VALID_PASSWORD},
        {"username": "", "password": VALID_PASSWORD},
        {"username": VALID_USERNAME, "password": ""},
        {},
    ],
    ids=["wrong-password", "unknown-user", "blank-username", "blank-password", "empty-body"],
)
def test_login_failure_returns_success_false(api, payload):
    response = api.post("/users/login", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is False
    assert body.get("message"), "失败时也应返回可读的 message"


def test_login_rejects_sql_injection_attempt(api):
    response = api.post("/users/login", json={"username": "' OR '1'='1", "password": "' OR '1'='1"})
    body = response.json()
    assert body["success"] is False, "登录接口不应被 SQL 注入绕过"


def test_login_malformed_json_returns_400(api):
    response = api.post(
        "/users/login",
        data="{this is not json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 400
    body = response.json()
    assert body["success"] is False
