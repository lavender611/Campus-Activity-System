
package com.campus.service;

import com.campus.entity.User;
import com.campus.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    // 查询所有用户
    public List<User> findAll() {
        return userMapper.findAll();
    }
}