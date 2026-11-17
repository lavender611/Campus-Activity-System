
package com.campus.mapper;

import com.campus.entity.Registration;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface RegistrationMapper {

    @Select("SELECT id, user_id AS userId, " +
            "activity_id AS activityId, " +
            "registration_time AS registrationTime, " +
            "status FROM registrations")
    List<Registration> findAll();
}