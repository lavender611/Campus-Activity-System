package com.campus.entity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class Activity {
    private Long id;

    @NotBlank(message = "活动名称不能为空")
    @Size(max = 150, message = "活动名称不能超过 150 个字符")
    private String title;

    @Size(max = 2000, message = "活动描述不能超过 2000 个字符")
    private String description;

    @NotBlank(message = "活动类别不能为空")
    @Size(max = 50, message = "活动类别不能超过 50 个字符")
    private String category;

    @NotBlank(message = "活动地点不能为空")
    @Size(max = 150, message = "活动地点不能超过 150 个字符")
    private String location;

    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;

    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;

    @NotNull(message = "报名名额不能为空")
    @Min(value = 1, message = "报名名额至少为 1")
    private Integer capacity;

    /** 只读统计字段，由查询语句计算，写入时会被忽略 */
    private Integer registeredCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
}
