package com.campus.mapper;

import com.campus.entity.Activity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ActivityMapper {
    List<Activity> findAll();
    Activity findById(@Param("id") Long id);
    int insert(Activity activity);
    int update(Activity activity);
    int deleteById(@Param("id") Long id);
}
