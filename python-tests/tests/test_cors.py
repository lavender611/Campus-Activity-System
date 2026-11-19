"""CORS：前端在 5173 / 5174 / 127.0.0.1 下都必须能正常跨域访问。"""

import pytest

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]


@pytest.mark.parametrize("origin", ALLOWED_ORIGINS)
def test_preflight_allows_local_dev_origin(api, origin):
    response = api.session.options(
        f"{api.base}/activities",
        headers={"Origin": origin, "Access-Control-Request-Method": "GET"},
        timeout=10,
    )
    assert response.status_code == 200, f"预检失败：{response.status_code} {response.text[:200]}"
    assert response.headers.get("Access-Control-Allow-Origin") == origin


def test_preflight_allows_json_content_type(api):
    origin = "http://localhost:5173"
    response = api.session.options(
        f"{api.base}/activities",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
        timeout=10,
    )
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == origin
    assert "POST" in response.headers.get("Access-Control-Allow-Methods", "")


def test_actual_request_gets_cors_header(api):
    origin = "http://127.0.0.1:5173"
    response = api.session.get(f"{api.base}/activities", headers={"Origin": origin}, timeout=10)
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == origin


def test_untrusted_origin_is_not_allowed(api):
    response = api.session.options(
        f"{api.base}/activities",
        headers={"Origin": "http://evil.example.com", "Access-Control-Request-Method": "GET"},
        timeout=10,
    )
    assert response.headers.get("Access-Control-Allow-Origin") is None, (
        "不应向不受信任的来源下发 CORS 响应头"
    )
