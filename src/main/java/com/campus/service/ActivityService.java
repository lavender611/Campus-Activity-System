
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

    // 查询所有校园活动
    public List<Activity> findAll() {
        return activityMapper.findAll();
    }
}