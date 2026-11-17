
package com.campus.controller;

import com.campus.entity.User;
import com.campus.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 查询所有用户
    @GetMapping
    public List<User> findAll() {
        return userService.findAll();
    }
}