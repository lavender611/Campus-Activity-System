"""服务可用性、活动列表结构与基础数据校验。"""

import re

import pytest

ISO_DATETIME = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")
REQUIRED_FIELDS = [
    "id",
    "title",
    "category",
    "location",
    "startTime",
    "endTime",
    "capacity",
    "registeredCount",
]


@pytest.mark.smoke
def test_activities_endpoint_available(api):
    response = api.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list), "活动列表接口应返回 JSON 数组"
    assert data, "活动列表为空，请先执行 database/campus_activity.sql 导入演示数据"


@pytest.mark.smoke
def test_seed_activities_present(api):
    data = api.get("/activities").json()
    assert len(data) >= 5, f"演示活动不足 5 条（当前 {len(data)}），请重新导入数据库脚本"


def test_activity_payload_shape(api):
    item = api.get("/activities").json()[0]
    for field in REQUIRED_FIELDS:
        assert field in item, f"活动对象缺少字段：{field}"
    assert isinstance(item["id"], int)
    assert isinstance(item["capacity"], int)
    assert isinstance(item["registeredCount"], int)
    assert item["registeredCount"] >= 0
    assert item["capacity"] >= 1


def test_activity_times_are_iso_strings(api):
    for item in api.get("/activities").json():
        assert ISO_DATETIME.match(item["startTime"]), f"startTime 不是 ISO 格式：{item['startTime']}"
        assert ISO_DATETIME.match(item["endTime"]), f"endTime 不是 ISO 格式：{item['endTime']}"


def test_activity_list_sorted_by_start_time(api):
    times = [item["startTime"] for item in api.get("/activities").json()]
    assert times == sorted(times), "活动列表应按开始时间升序返回"


def test_registered_count_never_exceeds_capacity(api):
    for item in api.get("/activities").json():
        assert item["registeredCount"] <= item["capacity"], (
            f"活动 {item['id']} 报名人数 {item['registeredCount']} 超过名额 {item['capacity']}"
        )


def test_unknown_endpoint_returns_json_404(api):
    response = api.get("/not-exists-endpoint")
    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
    assert "不存在" in body["message"]


def test_unsupported_method_returns_405(api):
    response = api.delete("/users/login")
    assert response.status_code == 405
    assert response.json()["success"] is False
