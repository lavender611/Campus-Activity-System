
package com.campus.controller;

import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    // 查询全部活动
    @GetMapping
    public List<Activity> findAll() {
        return activityService.findAll();
    }

    // 根据 ID 查询活动详情
    @GetMapping("/{id}")
    public Activity findById(@PathVariable Integer id) {
        return activityService.findById(id);
    }
}