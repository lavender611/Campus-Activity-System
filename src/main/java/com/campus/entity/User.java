
package com.campus.entity;

import java.time.LocalDateTime;

public class User {

    // 用户编号
    private Long id;

    // 用户名
    private String username;

    // 用户密码
    private String password;

    // 用户角色：USER 或 ADMIN
    private String role;

    // 创建时间
    private LocalDateTime createdAt;

    // 获取用户编号
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // 获取用户名
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // 获取密码
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // 获取角色
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // 获取创建时间
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}