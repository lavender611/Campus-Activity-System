package com.campus.entity;

import java.time.LocalDateTime;

public class Registration {
    private Long id;
    private Long userId;
    private Long activityId;
    private LocalDateTime registrationTime;
    private String status;
    private String username;
    private String activityTitle;
    private String activityLocation;
    private LocalDateTime activityStartTime;
    private LocalDateTime activityEndTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getActivityId() { return activityId; }
    public void setActivityId(Long activityId) { this.activityId = activityId; }
    public LocalDateTime getRegistrationTime() { return registrationTime; }
    public void setRegistrationTime(LocalDateTime registrationTime) { this.registrationTime = registrationTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getActivityTitle() { return activityTitle; }
    public void setActivityTitle(String activityTitle) { this.activityTitle = activityTitle; }
    public String getActivityLocation() { return activityLocation; }
    public void setActivityLocation(String activityLocation) { this.activityLocation = activityLocation; }
    public LocalDateTime getActivityStartTime() { return activityStartTime; }
    public void setActivityStartTime(LocalDateTime activityStartTime) { this.activityStartTime = activityStartTime; }
    public LocalDateTime getActivityEndTime() { return activityEndTime; }
    public void setActivityEndTime(LocalDateTime activityEndTime) { this.activityEndTime = activityEndTime; }
}
