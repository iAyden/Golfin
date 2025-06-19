package com.golfin.backend.controller;

import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.golfin.backend.dto.LoginRequest;
import com.golfin.backend.dto.LoginResponse;
import com.golfin.backend.dto.SignupDTO;
import com.golfin.backend.model.User;

import com.golfin.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;

import com.golfin.backend.util.PasswordUtil;

import jakarta.validation.Valid;

@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("entrando al endpoint de login con email " + loginRequest.getEmail());
        User userData = userRepository.findByEmail(loginRequest.getEmail());
        
        if(userData != null && PasswordUtil.matches(loginRequest.getPassword(),userData.getPswd())){ 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("correo o contraseñas invalidos"); }
        LoginResponse loginResponse = new LoginResponse(userData.getName(), userData.getEmail(), "fake-jwt-token");
        return ResponseEntity.ok(loginResponse);
    } 
    

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@Valid @RequestBody SignupDTO signupDTO) {

        if (userRepository.existsByEmail(signupDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email ya en uso.");
        }
        User newUser = new User();
        newUser.setEmail(signupDTO.getEmail());
        newUser.setName(signupDTO.getUsername());
        newUser.setPswd(PasswordUtil.hash(signupDTO.getPassword()))  ;
        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado con exito.");
}
}