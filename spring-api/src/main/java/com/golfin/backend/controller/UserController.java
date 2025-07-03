package com.golfin.backend.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.security.JwtUtil;

import com.golfin.backend.model.User;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader){
        if(authHeader == null || authHeader.startsWith("Bearer") ){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falta-token");
        }

        String token = authHeader.substring(7);
        if(!jwtUtil.validateToken(token)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalido");
        }
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email);
        return ResponseEntity.ok(user);
    }   

}