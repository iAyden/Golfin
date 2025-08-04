package com.golfin.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.golfin.backend.model.embedded.Achievement;

import com.golfin.backend.model.embedded.UserStats;
@Service
public class AchievementService {
   
    public List<Achievement> evaluateAchievementsGlobalStats(UserStats stats) {
        List<Achievement> unlocked = new ArrayList<>();

        unlocked.add(new Achievement("Beta Tester","Juega una partida de Golfin en su version beta"));

        if (stats.getWon() >= 1) {
            unlocked.add(new Achievement("Goflin!", "Gana tu primera partida de golfin"));
        }
        
        return unlocked;
        }
    public List<Achievement> evaluAchievementsFromGameStats(UserStats gStats){
        List<Achievement> unlocked = new ArrayList<>();
        if(gStats.getKarmaSpent()>=500){
            unlocked.add(new Achievement("Karmaico","Gasta 500 o más de Karma en una sola partida"));
        }
        if(gStats.getKarmaTrigger()>=10){
            unlocked.add(new Achievement("Blanco Facil","Te activaron 10 trampas en una partida"));
        }
        if(gStats.getSpringedTraps()==0){
            unlocked.add(new Achievement("Pacifista","No activar ni una sola trampa en la partida"));
        }
        if(gStats.getShots()==1 && gStats.getWon()==1){
            unlocked.add(new Achievement("Micro Ratón","Hoyo en Uno"));    
        }
        return unlocked;
    }
    
    }
