"""活动增删改查（管理员核心链路）与级联删除。"""

import pytest


@pytest.mark.smoke
def test_create_activity_returns_id(api, activity_factory):
    activity_id = activity_factory()
    assert isinstance(activity_id, int) and activity_id > 0


def test_created_activity_can_be_fetched(api, activity_factory):
    activity_id = activity_factory(title="详情校验活动", capacity=12)
    body = api.get(f"/activities/{activity_id}").json()
    assert body["id"] == activity_id
    assert body["title"] == "详情校验活动"
    assert body["capacity"] == 12
    assert body["registeredCount"] == 0


def test_new_activity_appears_in_list(api, activity_factory):
    activity_id = activity_factory(title="列表可见性校验")
    ids = [item["id"] for item in api.get("/activities").json()]
    assert activity_id in ids


def test_update_activity(api, activity_factory, activity_payload):
    activity_id = activity_factory(title="修改前")
    payload = activity_payload(
        title="修改后",
        category="志愿服务",
        location="大学生活动中心",
        capacity=50,
    )
    response = api.put(f"/activities/{activity_id}", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True

    updated = api.get(f"/activities/{activity_id}").json()
    assert updated["title"] == "修改后"
    assert updated["category"] == "志愿服务"
    assert updated["location"] == "大学生活动中心"
    assert updated["capacity"] == 50


def test_delete_activity(api, activity_factory):
    activity_id = activity_factory()
    response = api.delete(f"/activities/{activity_id}")
    assert response.json()["success"] is True
    assert api.get(f"/activities/{activity_id}").status_code == 404


def test_delete_missing_activity_reports_failure(api):
    response = api.delete("/activities/99999999")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is False
    assert body["message"] == "活动不存在"


def test_update_missing_activity_returns_404(api, activity_payload):
    response = api.put("/activities/99999999", json=activity_payload())
    assert response.status_code == 404
    assert response.json()["message"] == "活动不存在"


def test_get_missing_activity_returns_404(api):
    response = api.get("/activities/99999999")
    assert response.status_code == 404
    assert response.json()["success"] is False


def test_delete_activity_cascades_registrations(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]

    register = api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    assert register.json()["success"] is True, register.text
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 1

    api.delete(f"/activities/{activity_id}")
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 0
