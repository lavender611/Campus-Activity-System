
package com.campus.service;

import com.campus.entity.Registration;
import com.campus.mapper.RegistrationMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationMapper registrationMapper;

    public RegistrationService(RegistrationMapper registrationMapper) {
        this.registrationMapper = registrationMapper;
    }

    // 查询全部报名记录
    public List<Registration> findAll() {
        return registrationMapper.findAll();
    }

    // 根据学生ID查询个人报名记录
    public List<Registration> findByUserId(Long userId) {
        return registrationMapper.findByUserId(userId);
    }

    // 检查是否已经报名
    public boolean hasRegistered(Long userId, Long activityId) {
        return registrationMapper.countByUserAndActivity(userId, activityId) > 0;
    }

    // 查询活动报名人数
    public int countByActivityId(Long activityId) {
        return registrationMapper.countByActivityId(activityId);
    }

    // 报名
    public boolean register(Registration registration) {

        Long userId = registration.getUserId();
        Long activityId = registration.getActivityId();

        // 已经报名，拒绝重复报名
        if (hasRegistered(userId, activityId)) {
            return false;
        }

        // 查询是否存在历史记录
        int historyCount = registrationMapper.countHistory(userId, activityId);

        // 有历史记录，恢复原来的报名
        if (historyCount > 0) {
            return registrationMapper.restoreRegistration(
                    userId, activityId
            ) > 0;
        }

        // 没有历史记录，新增报名
        return registrationMapper.insert(registration) > 0;
    }

    // 取消报名
    public boolean cancelRegistration(Long userId, Long activityId) {

        if (!hasRegistered(userId, activityId)) {
            return false;
        }

        return registrationMapper.cancelRegistration(
                userId, activityId
        ) > 0;
    }
}