
package com.campus.mapper;

import com.campus.entity.Activity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ActivityMapper {

    @Select("SELECT id, title, description, location, " +
            "start_time AS startTime, " +
            "end_time AS endTime, capacity, status, " +
            "created_at AS createdAt FROM activities")
    List<Activity> findAll();
}