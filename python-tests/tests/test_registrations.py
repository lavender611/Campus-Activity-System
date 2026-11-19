"""报名 / 取消报名：幂等、人数统计、数据隔离、名额上限。"""

import pytest


@pytest.mark.smoke
def test_register_activity(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]

    response = api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    body = response.json()
    assert body["success"] is True
    assert body["message"] == "报名成功"
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 1


def test_duplicate_registration_is_rejected(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]
    api.post("/registrations", json={"userId": student_id, "activityId": activity_id})

    second = api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    body = second.json()
    assert body["success"] is False
    assert body["message"] == "你已经报名该活动"
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 1


@pytest.mark.smoke
def test_cancel_registration(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]
    api.post("/registrations", json={"userId": student_id, "activityId": activity_id})

    response = api.put(f"/registrations/cancel/{student_id}/{activity_id}")
    body = response.json()
    assert body["success"] is True
    assert body["message"] == "取消报名成功"
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 0


def test_cancel_twice_reports_no_valid_record(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]
    api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    api.put(f"/registrations/cancel/{student_id}/{activity_id}")

    second = api.put(f"/registrations/cancel/{student_id}/{activity_id}")
    body = second.json()
    assert body["success"] is False
    assert body["message"] == "没有找到有效报名记录"


def test_reregister_after_cancel(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]

    api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    api.put(f"/registrations/cancel/{student_id}/{activity_id}")

    again = api.post("/registrations", json={"userId": student_id, "activityId": activity_id})
    assert again.json()["success"] is True, "取消后应允许重新报名"
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 1


def test_my_registrations_only_contains_own_records(api, activity_factory, users):
    activity_id = activity_factory()
    student01 = users["student01"]["id"]
    student02 = users["student02"]["id"]

    api.post("/registrations", json={"userId": student01, "activityId": activity_id})
    api.post("/registrations", json={"userId": student02, "activityId": activity_id})

    mine = api.get(f"/registrations/user/{student01}").json()
    assert isinstance(mine, list)
    assert all(record["userId"] == student01 for record in mine), "学生只能看到自己的报名记录"
    assert any(record["activityId"] == activity_id for record in mine)


def test_activity_roster_contains_student_username(api, activity_factory, users):
    activity_id = activity_factory()
    student_id = users["student01"]["id"]
    api.post("/registrations", json={"userId": student_id, "activityId": activity_id})

    roster = api.get(f"/registrations/activity/{activity_id}").json()
    assert len(roster) == 1
    assert roster[0]["userId"] == student_id
    assert roster[0]["username"] == "student01"
    assert roster[0]["status"] == "REGISTERED"


def test_capacity_limit_is_enforced(api, activity_factory, users):
    activity_id = activity_factory(title="仅一个名额", capacity=1)

    first = api.post(
        "/registrations",
        json={"userId": users["student01"]["id"], "activityId": activity_id},
    )
    assert first.json()["success"] is True

    second = api.post(
        "/registrations",
        json={"userId": users["student02"]["id"], "activityId": activity_id},
    )
    body = second.json()
    assert body["success"] is False
    assert body["message"] == "活动名额已满"
    assert api.get(f"/registrations/count/{activity_id}").json()["count"] == 1


def test_register_with_unknown_user_is_rejected(api, activity_factory):
    activity_id = activity_factory()
    response = api.post("/registrations", json={"userId": 99999999, "activityId": activity_id})
    body = response.json()
    assert body["success"] is False
    assert "用户不存在" in body["message"]


def test_register_with_unknown_activity_is_rejected(api, users):
    response = api.post(
        "/registrations",
        json={"userId": users["student01"]["id"], "activityId": 99999999},
    )
    body = response.json()
    assert body["success"] is False
    assert body["message"] == "活动不存在"


def test_register_without_user_id_is_rejected(api, activity_factory):
    activity_id = activity_factory()
    response = api.post("/registrations", json={"activityId": activity_id})
    body = response.json()
    assert body["success"] is False
    assert "缺少" in body["message"]
