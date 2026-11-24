package com.campus.service;

import com.campus.entity.Activity;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.RegistrationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ActivityService {
    private final ActivityMapper activities;
    private final RegistrationMapper registrations;
    public ActivityService(ActivityMapper activities, RegistrationMapper registrations) {
        this.activities = activities; this.registrations = registrations;
    }
    public List<Activity> findAll() { return activities.findAll(); }
    public Activity findById(Long id) { return activities.findById(id); }
    public int save(Activity a) {
        if (a.getId() == null) return activities.insert(a);
        return activities.update(a);
    }
    @Transactional
    public int delete(Long id) {
        registrations.deleteByActivityId(id);
        return activities.deleteById(id);
    }
}
