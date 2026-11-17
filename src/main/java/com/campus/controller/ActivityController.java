
package com.campus.controller;

import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    // 查询所有校园活动
    @GetMapping
    public List<Activity> findAll() {
        return activityService.findAll();
    }
}