package com.golfin.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.golfin.backend.dto.UserStatsDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.model.embedded.Achievement;
import com.golfin.backend.model.embedded.GameHistory;
import com.golfin.backend.model.embedded.UserStats;
import com.golfin.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class StatsService {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AchievementService achievementService;
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
        int totalGamesPrev = (user.getGameHistory() != null) ? user.getGameHistory().size() : 0;
        int totalGamesNew = totalGamesPrev + 1;
        if (existingStats == null) {
            user.setStats(newStats);
        } else {
            double sumPosition = existingStats.getPosition() * totalGamesPrev + newStats.getPosition();
            double avgPosition = sumPosition / totalGamesNew;
            int avgPostionInt = (int) Math.round(avgPosition);

            double sumPoints = existingStats.getPoints() * totalGamesPrev + newStats.getPoints();
            double avgPoints = sumPoints / totalGamesNew;
            int avgPointsInt = (int) Math.round(avgPoints);
            existingStats.setPosition(avgPostionInt);
            existingStats.setShots(existingStats.getShots() + newStats.getShots());
            existingStats.setPoints(avgPointsInt);
            existingStats.setSpringedTraps(existingStats.getSpringedTraps() + newStats.getSpringedTraps());
            existingStats.setWon(existingStats.getWon() + newStats.getWon());
        }

        
        List<Achievement> currentAchievements = user.getAchievements();
        if(currentAchievements == null){
            currentAchievements = new ArrayList<>();
        }
        
        List<Achievement> newAchievements = new ArrayList<>();

        
        for (Achievement a : achievementService.evaluAchievementsFromGameStats(newStats)) {
            if (!currentAchievements.contains(a) && !newAchievements.contains(a)) {
                newAchievements.add(a);
            }
        }

        for (Achievement a : achievementService.evaluateAchievementsGlobalStats(existingStats)) {
            if (!currentAchievements.contains(a) && !newAchievements.contains(a)) {
                newAchievements.add(a);
            }
        }
        GameHistory gameHistory = new GameHistory();
        gameHistory.setId(newStats.getid()); 
        gameHistory.setUserStats(newStats);

        if (user.getGameHistory() == null) {
                user.setGameHistory(new ArrayList<>());
            }
            user.getGameHistory().add(gameHistory);
        currentAchievements.addAll(newAchievements);

        user.setAchievements(currentAchievements);
        userRepository.save(user);
        return true;
        }
    
}