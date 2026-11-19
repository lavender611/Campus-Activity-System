package com.campus.service;

import com.campus.entity.Activity;
import com.campus.entity.Registration;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.RegistrationMapper;
import com.campus.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegistrationService {
    private final RegistrationMapper registrations;
    private final ActivityMapper activities;
    private final UserMapper users;

    public RegistrationService(RegistrationMapper registrations, ActivityMapper activities, UserMapper users) {
        this.registrations = registrations;
        this.activities = activities;
        this.users = users;
    }

    public List<Registration> findAll() { return registrations.findAll(); }
    public List<Registration> findByUser(Long userId) { return registrations.findByUserId(userId); }
    public List<Registration> findByActivity(Long activityId) { return registrations.findByActivityId(activityId); }
    public int count(Long activityId) { return registrations.countRegistered(activityId); }

    @Transactional
    public String register(Long userId, Long activityId) {
        if (userId == null || activityId == null) return "缺少用户 ID 或活动 ID";
        if (users.findById(userId) == null) return "用户不存在，请重新登录";
        Activity activity = activities.findById(activityId);
        if (activity == null) return "活动不存在";
        Registration old = registrations.findOne(userId, activityId);
        if (old != null && "REGISTERED".equals(old.getStatus())) return "你已经报名该活动";
        int capacity = activity.getCapacity() == null ? 0 : activity.getCapacity();
        if (registrations.countRegistered(activityId) >= capacity) return "活动名额已满";
        registrations.insert(userId, activityId);
        return "报名成功";
    }

    @Transactional
    public String cancel(Long userId, Long activityId) {
        if (userId == null || activityId == null) return "缺少用户 ID 或活动 ID";
        int changed = registrations.cancel(userId, activityId);
        return changed > 0 ? "取消报名成功" : "没有找到有效报名记录";
    }
}
