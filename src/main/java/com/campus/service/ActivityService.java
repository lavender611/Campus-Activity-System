
package com.campus.service;

import com.campus.entity.Activity;
import com.campus.mapper.ActivityMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityMapper activityMapper;

    public ActivityService(ActivityMapper activityMapper) {
        this.activityMapper = activityMapper;
    }

    // 查询全部活动
    public List<Activity> findAll() {
        return activityMapper.findAll();
    }

    // 根据 ID 查询活动
    public Activity findById(Integer id) {
        return activityMapper.findById(id);
    }
}