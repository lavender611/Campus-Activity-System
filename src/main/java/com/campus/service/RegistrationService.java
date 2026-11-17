
package com.campus.service;

import com.campus.entity.Registration;
import com.campus.mapper.RegistrationMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationMapper registrationMapper;

    public RegistrationService(RegistrationMapper registrationMapper) {
        this.registrationMapper = registrationMapper;
    }

    // 查询所有报名记录
    public List<Registration> findAll() {
        return registrationMapper.findAll();
    }
}