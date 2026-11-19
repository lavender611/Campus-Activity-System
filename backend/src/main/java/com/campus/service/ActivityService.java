package com.campus.service;

import com.campus.entity.Activity;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.RegistrationMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityMapper activities;
    private final RegistrationMapper registrations;

    public ActivityService(ActivityMapper activities, RegistrationMapper registrations) {
        this.activities = activities;
        this.registrations = registrations;
    }

    public List<Activity> findAll() { return activities.findAll(); }

    public Activity findById(Long id) {
        Activity activity = activities.findById(id);
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "活动不存在");
        }
        return activity;
    }

    public int save(Activity activity) {
        validateTimeRange(activity);
        if (activity.getId() == null) {
            return activities.insert(activity);
        }
        if (activities.findById(activity.getId()) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "活动不存在");
        }
        return activities.update(activity);
    }

    @Transactional
    public int delete(Long id) {
        registrations.deleteByActivityId(id);
        return activities.deleteById(id);
    }

    /** 校验结束时间必须晚于开始时间，避免写入脏数据 */
    private void validateTimeRange(Activity activity) {
        if (activity.getStartTime() != null && activity.getEndTime() != null
                && !activity.getEndTime().isAfter(activity.getStartTime())) {
            throw new IllegalArgumentException("结束时间必须晚于开始时间");
        }
    }
}
