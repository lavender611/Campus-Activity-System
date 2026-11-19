package com.campus.controller;

import com.campus.entity.User;
import com.campus.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        User user = service.login(body.getOrDefault("username", ""), body.getOrDefault("password", ""));
        if (user == null) return Map.of("success", false, "message", "账号或密码错误");
        return Map.of("success", true, "message", "登录成功", "user", user);
    }
}
