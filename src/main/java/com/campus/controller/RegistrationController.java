
package com.campus.controller;

import com.campus.entity.Registration;
import com.campus.service.RegistrationService;
import com.campus.service.ActivityService;
import com.campus.entity.Activity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final ActivityService activityService;

    public RegistrationController(
            RegistrationService registrationService,
            ActivityService activityService) {
        this.registrationService = registrationService;
        this.activityService = activityService;
    }

    // 查询全部报名记录
    @GetMapping
    public List<Registration> findAll() {
        return registrationService.findAll();
    }

    // 根据学生ID查询个人报名记录
    @GetMapping("/user/{userId}")
    public List<Registration> findByUserId(@PathVariable Long userId) {
        return registrationService.findByUserId(userId);
    }

    // 查询活动报名人数
    @GetMapping("/count/{activityId}")
    public int countByActivityId(@PathVariable Long activityId) {
        return registrationService.countByActivityId(activityId);
    }

    // 学生报名
    @PostMapping
    public Map<String, Object> register(
            @RequestBody Registration registration) {

        Map<String, Object> result = new HashMap<>();

        if (registration == null
                || registration.getUserId() == null
                || registration.getActivityId() == null) {
            result.put("success", false);
            result.put("message", "用户ID或活动ID不能为空");
            return result;
        }

        Activity activity = activityService.findById(
                registration.getActivityId().intValue()
        );

        if (activity == null) {
            result.put("success", false);
            result.put("message", "活动不存在");
            return result;
        }

        if (registrationService.hasRegistered(
                registration.getUserId(),
                registration.getActivityId())) {
            result.put("success", false);
            result.put("message", "你已经报名过该活动");
            return result;
        }

        int signed = registrationService.countByActivityId(
                registration.getActivityId()
        );

        if (signed >= activity.getCapacity()) {
            result.put("success", false);
            result.put("message", "活动名额已满");
            return result;
        }

        boolean success = registrationService.register(registration);

        result.put("success", success);
        result.put("message", success ? "报名成功" : "报名失败");

        return result;
    }

    // 取消报名
    @PutMapping("/cancel/{userId}/{activityId}")
    public Map<String, Object> cancelRegistration(
            @PathVariable Long userId,
            @PathVariable Long activityId) {

        Map<String, Object> result = new HashMap<>();

        boolean success = registrationService.cancelRegistration(
                userId, activityId
        );

        result.put("success", success);
        result.put("message", success ? "取消报名成功" : "取消失败或尚未报名");

        return result;
    }
}