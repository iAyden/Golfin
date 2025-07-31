package com.golfin.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.golfin.backend.dto.UserStatsDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.model.embedded.UserStats;
import com.golfin.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class StatsService {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;

    public boolean addStats(UserStatsDTO statsDTO) {
    User user = userRepository.findByUsername(statsDTO.getUsername()).orElse(null);
    if (user == null) return false;
    try{    
        System.out.println("user stats"+objectMapper.writeValueAsString(user.getStats()));
    } catch (JsonProcessingException e) {
            e.printStackTrace();
    }
    UserStats existingStats = user.getStats(); 
    UserStats newStats = statsDTO.getData();   

    if (existingStats == null) {
        user.setStats(newStats);
    } else {
        existingStats.setPosition(existingStats.getPosition() + newStats.getPosition());
        existingStats.setShots(existingStats.getShots() + newStats.getShots());
        existingStats.setPoints(existingStats.getPoints() + newStats.getPoints());
        existingStats.setSpringedTraps(existingStats.getSpringedTraps() + newStats.getSpringedTraps());
        existingStats.setWon(existingStats.getWon() + newStats.getWon());
    }

    userRepository.save(user);
    return true;
    }
}