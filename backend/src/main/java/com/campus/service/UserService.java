package com.campus.service;

import com.campus.entity.User;
import com.campus.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper mapper;

    public UserService(UserMapper mapper) { this.mapper = mapper; }

    public User login(String username, String password) {
        if (username == null || username.isBlank() || password == null || password.isEmpty()) {
            return null;
        }
        User user = mapper.findByUsername(username.trim());
        if (user == null || user.getPassword() == null || !user.getPassword().equals(password)) {
            return null;
        }
        user.setPassword(null);
        return user;
    }
}
