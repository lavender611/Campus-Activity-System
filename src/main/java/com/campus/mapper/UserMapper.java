
package com.campus.mapper;

import com.campus.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT id, username, password, role, " +
            "created_at AS createdAt FROM users")
    List<User> findAll();
}