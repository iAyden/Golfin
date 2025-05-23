package com.golfin.backend.controller;


import com.golfin.backend.model.User;

import com.golfin.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import com.golfin.backend.util.PasswordUtil;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        
        User userData = userRepository.findByEmail(user.getEmail());

        if(userData != null && PasswordUtil.matches(user.getPswd(),userData.getPswd())){
            
            return userData;
        }

        User failedUser = new User();
        return failedUser;
    } 
    

    @PostMapping("/signup")
    public User createUser(@RequestBody User user) {

        user.setPswd(PasswordUtil.hash(user.getPswd()))  ;
        return userRepository.save(user);
    }
}
