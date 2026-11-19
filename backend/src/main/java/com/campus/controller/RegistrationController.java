package com.campus.controller;

import com.campus.entity.Registration;
import com.campus.service.RegistrationService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationService service;

    public RegistrationController(RegistrationService service) { this.service = service; }

    @GetMapping
    public List<Registration> all() { return service.findAll(); }

    @GetMapping("/user/{userId}")
    public List<Registration> byUser(@PathVariable Long userId) { return service.findByUser(userId); }

    @GetMapping("/activity/{activityId}")
    public List<Registration> byActivity(@PathVariable Long activityId) { return service.findByActivity(activityId); }

    @GetMapping("/count/{activityId}")
    public Map<String, Object> count(@PathVariable Long activityId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("activityId", activityId);
        body.put("count", service.count(activityId));
        return body;
    }

    @PostMapping
    public Map<String, Object> register(@RequestBody Map<String, Long> body) {
        Long userId = body == null ? null : body.get("userId");
        Long activityId = body == null ? null : body.get("activityId");
        String message = service.register(userId, activityId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", "报名成功".equals(message));
        result.put("message", message);
        return result;
    }

    @PutMapping("/cancel/{userId}/{activityId}")
    public Map<String, Object> cancel(@PathVariable Long userId, @PathVariable Long activityId) {
        String message = service.cancel(userId, activityId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", "取消报名成功".equals(message));
        result.put("message", message);
        return result;
    }
}
