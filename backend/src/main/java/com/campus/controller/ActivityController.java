package com.campus.controller;

import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService service;

    public ActivityController(ActivityService service) { this.service = service; }

    @GetMapping
    public List<Activity> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Activity one(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public Map<String, Object> create(@Valid @RequestBody Activity activity) {
        activity.setId(null);
        activity.setRegisteredCount(null);
        service.save(activity);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", "活动发布成功");
        body.put("id", activity.getId());
        return body;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @Valid @RequestBody Activity activity) {
        activity.setId(id);
        int n = service.save(activity);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", n > 0);
        body.put("message", n > 0 ? "活动修改成功" : "活动不存在");
        return body;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        int n = service.delete(id);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", n > 0);
        body.put("message", n > 0 ? "活动删除成功" : "活动不存在");
        return body;
    }
}
