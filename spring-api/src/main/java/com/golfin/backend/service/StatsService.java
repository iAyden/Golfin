package com.golfin.backend.service;

import com.golfin.backend.dto.UserStatsDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private UserRepository userRepository;

    public boolean addStats(UserStatsDTO statsDTO) {
        User user = userRepository.findByUsername(statsDTO.getUsername());
        if (user == null) {
            return false;
        }

        user.getStats().add(statsDTO.getData());
        userRepository.save(user);
        return true;
    }
}
