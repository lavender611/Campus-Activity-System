package com.campus.service;

import com.campus.entity.Activity;
import com.campus.entity.Registration;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.RegistrationMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegistrationService {
    private final RegistrationMapper registrations;
    private final ActivityMapper activities;
    public RegistrationService(RegistrationMapper registrations, ActivityMapper activities) {
        this.registrations = registrations; this.activities = activities;
    }
    public List<Registration> findAll() { return registrations.findAll(); }
    public List<Registration> findByUser(Long userId) { return registrations.findByUserId(userId); }
    public List<Registration> findByActivity(Long activityId) { return registrations.findByActivityId(activityId); }
    public int count(Long activityId) { return registrations.countRegistered(activityId); }
    public String register(Long userId, Long activityId) {
        Activity a = activities.findById(activityId);
        if (a == null) return "活动不存在";
        Registration old = registrations.findOne(userId, activityId);
        if (old != null && "REGISTERED".equals(old.getStatus())) return "你已经报名该活动";
        if (registrations.countRegistered(activityId) >= a.getCapacity()) return "活动名额已满";
        registrations.insert(userId, activityId);
        return "报名成功";
    }
    public String cancel(Long userId, Long activityId) {
        int changed = registrations.cancel(userId, activityId);
        return changed > 0 ? "取消报名成功" : "没有找到有效报名记录";
    }
}
