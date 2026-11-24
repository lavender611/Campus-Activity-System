package com.campus.service;

import com.campus.entity.User;
import com.campus.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper mapper;
    public UserService(UserMapper mapper) { this.mapper = mapper; }

    public User login(String username, String password) {
        User user = mapper.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) return null;
        user.setPassword(null);
        return user;
    }
}
