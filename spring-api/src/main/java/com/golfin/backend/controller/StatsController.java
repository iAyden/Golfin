package com.golfin.backend.controller;

import com.golfin.backend.dto.GameStatsDTO;
import com.golfin.backend.dto.UserStatsDTO;
import com.golfin.backend.model.embedded.GameStats;
import com.golfin.backend.service.StatsService;
import java.util.Optional;
import java.util.List;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add-ustats")
    public ResponseEntity<String> addUserStats(@RequestBody UserStatsDTO statsDTO) {
        boolean success = statsService.addStats(statsDTO);
        if (!success) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok("Stats added");
    }

    
}
