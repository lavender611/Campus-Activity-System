
package com.campus.controller;

import com.campus.entity.Registration;
import com.campus.service.RegistrationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // 查询所有报名记录
    @GetMapping
    public List<Registration> findAll() {
        return registrationService.findAll();
    }
}