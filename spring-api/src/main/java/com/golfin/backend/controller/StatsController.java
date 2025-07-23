package com.golfin.backend.controller;


import com.golfin.backend.dto.UserStatsDTO;

import com.golfin.backend.service.StatsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @PostMapping("/add-ustats")
    public ResponseEntity<String> addUserStats(@RequestBody UserStatsDTO statsDTO) {
        boolean success = statsService.addStats(statsDTO);
        if (!success) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok("Stats added");
    }

    
}
