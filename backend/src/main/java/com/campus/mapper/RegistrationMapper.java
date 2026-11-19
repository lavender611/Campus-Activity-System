package com.campus.mapper;

import com.campus.entity.Registration;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface RegistrationMapper {
    List<Registration> findAll();
    List<Registration> findByUserId(@Param("userId") Long userId);
    List<Registration> findByActivityId(@Param("activityId") Long activityId);
    Registration findOne(@Param("userId") Long userId, @Param("activityId") Long activityId);
    int countRegistered(@Param("activityId") Long activityId);
    int insert(@Param("userId") Long userId, @Param("activityId") Long activityId);
    int cancel(@Param("userId") Long userId, @Param("activityId") Long activityId);
    int deleteByActivityId(@Param("activityId") Long activityId);
}
