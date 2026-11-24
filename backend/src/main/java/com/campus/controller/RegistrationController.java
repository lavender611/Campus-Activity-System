package com.campus.controller;

import com.campus.service.RegistrationService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationService service;
    public RegistrationController(RegistrationService service) { this.service = service; }

    @GetMapping
    public Object all() { return service.findAll(); }

    @GetMapping("/user/{userId}")
    public Object byUser(@PathVariable Long userId) { return service.findByUser(userId); }

    @GetMapping("/activity/{activityId}")
    public Object byActivity(@PathVariable Long activityId) { return service.findByActivity(activityId); }

    @GetMapping("/count/{activityId}")
    public Map<String, Object> count(@PathVariable Long activityId) {
        return Map.of("activityId", activityId, "count", service.count(activityId));
    }

    @PostMapping
    public Map<String, Object> register(@RequestBody Map<String, Long> body) {
        String message = service.register(body.get("userId"), body.get("activityId"));
        return Map.of("success", "报名成功".equals(message), "message", message);
    }

    @PutMapping("/cancel/{userId}/{activityId}")
    public Map<String, Object> cancel(@PathVariable Long userId, @PathVariable Long activityId) {
        String message = service.cancel(userId, activityId);
        return Map.of("success", "取消报名成功".equals(message), "message", message);
    }
}
