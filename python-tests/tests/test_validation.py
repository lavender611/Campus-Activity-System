"""参数校验：非法请求必须返回 400 + JSON 中文提示，而不是 500 或 HTML 错误页。"""

import pytest


def assert_client_error(response, keyword: str | None = None) -> None:
    assert response.status_code == 400, f"期望 400，实际 {response.status_code}：{response.text}"
    content_type = response.headers.get("Content-Type", "")
    assert content_type.startswith("application/json"), f"错误响应应为 JSON，实际：{content_type}"
    body = response.json()
    assert body["success"] is False
    assert body.get("message"), "错误响应必须带 message"
    if keyword:
        assert keyword in body["message"], f"提示信息未包含「{keyword}」：{body['message']}"


@pytest.mark.parametrize(
    ("field", "value", "keyword"),
    [
        ("title", "", "活动名称"),
        ("title", "   ", "活动名称"),
        ("category", "", "活动类别"),
        ("location", "", "活动地点"),
        ("capacity", 0, "报名名额"),
        ("capacity", -5, "报名名额"),
    ],
    ids=[
        "empty-title",
        "blank-title",
        "empty-category",
        "empty-location",
        "zero-capacity",
        "negative-capacity",
    ],
)
def test_invalid_field_rejected(api, activity_payload, field, value, keyword):
    payload = activity_payload(**{field: value})
    assert_client_error(api.post("/activities", json=payload), keyword)


@pytest.mark.parametrize(
    "field",
    ["title", "category", "location", "startTime", "endTime", "capacity"],
)
def test_missing_required_field_rejected(api, activity_payload, field):
    payload = activity_payload()
    payload.pop(field)
    assert_client_error(api.post("/activities", json=payload), "不能为空")


def test_end_before_start_rejected(api, activity_payload):
    payload = activity_payload(startTime="2026-12-20T12:00:00", endTime="2026-12-20T09:00:00")
    assert_client_error(api.post("/activities", json=payload), "结束时间必须晚于开始时间")


def test_end_equal_start_rejected(api, activity_payload):
    payload = activity_payload(startTime="2026-12-20T09:00:00", endTime="2026-12-20T09:00:00")
    assert_client_error(api.post("/activities", json=payload), "结束时间必须晚于开始时间")


def test_malformed_datetime_rejected(api, activity_payload):
    # 用空格代替 ISO 的 "T"，后端应返回 400 而不是 500
    payload = activity_payload(startTime="2026-12-20 09:00:00")
    assert_client_error(api.post("/activities", json=payload), "时间格式")


def test_title_too_long_rejected(api, activity_payload):
    payload = activity_payload(title="活" * 151)
    assert_client_error(api.post("/activities", json=payload), "150")


def test_description_too_long_rejected(api, activity_payload):
    payload = activity_payload(description="字" * 2001)
    assert_client_error(api.post("/activities", json=payload), "2000")


def test_non_numeric_path_variable_rejected(api):
    response = api.get("/activities/not-a-number")
    assert response.status_code == 400
    body = response.json()
    assert body["success"] is False
    assert "id" in body["message"]


def test_malformed_json_body_rejected(api):
    response = api.post(
        "/activities",
        data='{"title": "缺少引号}',
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 400
    assert response.json()["success"] is False


def test_valid_payload_still_accepted(api, activity_factory):
    """对照组：合法请求必须成功，避免校验过严误伤正常流程。"""
    activity_id = activity_factory(title="合法活动", capacity=1)
    assert activity_id > 0
