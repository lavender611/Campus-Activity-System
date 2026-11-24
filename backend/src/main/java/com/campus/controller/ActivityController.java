package com.campus.controller;

import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import org.springframework.web.bind.annotation.*;
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
    public Map<String, Object> create(@RequestBody Activity activity) {
        activity.setId(null);
        service.save(activity);
        return Map.of("success", true, "message", "活动发布成功", "id", activity.getId());
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Activity activity) {
        activity.setId(id);
        int n = service.save(activity);
        return Map.of("success", n > 0, "message", n > 0 ? "活动修改成功" : "活动不存在");
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        int n = service.delete(id);
        return Map.of("success", n > 0, "message", n > 0 ? "活动删除成功" : "活动不存在");
    }
}
