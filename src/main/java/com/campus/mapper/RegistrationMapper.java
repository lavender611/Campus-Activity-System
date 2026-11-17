
package com.campus.mapper;

import com.campus.entity.Registration;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface RegistrationMapper {

    // 查询全部报名记录
    @Select("SELECT id, user_id AS userId, " +
            "activity_id AS activityId, " +
            "registration_time AS registrationTime, " +
            "status FROM registrations")
    List<Registration> findAll();

    // 根据学生ID查询个人报名记录
    @Select("SELECT id, user_id AS userId, " +
            "activity_id AS activityId, " +
            "registration_time AS registrationTime, " +
            "status FROM registrations " +
            "WHERE user_id = #{userId}")
    List<Registration> findByUserId(Long userId);

    // 检查学生是否已经报名
    @Select("SELECT COUNT(*) FROM registrations " +
            "WHERE user_id = #{userId} " +
            "AND activity_id = #{activityId} " +
            "AND status = 'REGISTERED'")
    int countByUserAndActivity(Long userId, Long activityId);

    // 查询活动报名人数
    @Select("SELECT COUNT(*) FROM registrations " +
            "WHERE activity_id = #{activityId} " +
            "AND status = 'REGISTERED'")
    int countByActivityId(Long activityId);

    // 新增报名记录
    @Insert("INSERT INTO registrations " +
            "(user_id, activity_id, registration_time, status) " +
            "VALUES (#{userId}, #{activityId}, NOW(), 'REGISTERED')")
    int insert(Registration registration);

    // 取消报名
    @Update("UPDATE registrations SET status = 'CANCELLED' " +
            "WHERE user_id = #{userId} " +
            "AND activity_id = #{activityId} " +
            "AND status = 'REGISTERED'")
    int cancelRegistration(Long userId, Long activityId);

    // 查询历史报名记录数量
    @Select("SELECT COUNT(*) FROM registrations " +
            "WHERE user_id = #{userId} " +
            "AND activity_id = #{activityId}")
    int countHistory(Long userId, Long activityId);

    // 恢复已经取消的报名记录
    @Update("UPDATE registrations SET status = 'REGISTERED', " +
            "registration_time = NOW() " +
            "WHERE user_id = #{userId} " +
            "AND activity_id = #{activityId} " +
            "AND status = 'CANCELLED'")
    int restoreRegistration(Long userId, Long activityId);
}