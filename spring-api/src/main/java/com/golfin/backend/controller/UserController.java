package com.golfin.backend.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.security.JwtUtil;
import com.golfin.backend.dto.UserProfileDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.model.embedded.Achievement;
import com.golfin.backend.model.embedded.GameHistory;

import java.util.*;
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
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falta-token");
    }

    String token = authHeader.substring(7);
    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalido");
    }

    String email = jwtUtil.extractEmail(token);
    User user = userRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    UserProfileDTO dto = new UserProfileDTO();
    dto.setUsername(user.getUsername());
    dto.setEmail(user.getEmail());
    dto.setPhotoUrl(user.getphotoURL());
    dto.setAchievements(user.getAchievements());
    dto.setGameHistory(user.getGameHistory());
    dto.setFriends(user.getFriends());

    return ResponseEntity.ok(dto);
    }

    //este endpoint va a recibir el objeto cuando termine una partida para añadir a su historial
      @PostMapping("/add-game")
    public ResponseEntity<?> addGame(@RequestHeader("Authorization") String authHeader,
                                     @RequestBody GameHistory game) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        if (user.getGameHistory() == null) user.setGameHistory(new ArrayList<>());
        user.getGameHistory().add(game);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Partida añadida correctamente"));
    }

    @PostMapping("/add-achievement")
    public ResponseEntity<?> addAchievement(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody Achievement achievement) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        if (user.getAchievements() == null) user.setAchievements(new ArrayList<>());
        user.getAchievements().add(achievement);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Logro añadido correctamente"));
    }

    @PostMapping("/add-friend")
    public ResponseEntity<?> addFriend(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody Map<String, String> body) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        String friendId = body.get("friendId");
        if (friendId == null) return ResponseEntity.badRequest().body("Falta friendId");

        if (user.getFriends() == null) user.setFriends(new ArrayList<>());
        if (!user.getFriends().contains(friendId)) {
            user.getFriends().add(friendId);
            userRepository.save(user);
        }
        return ResponseEntity.ok(Map.of("message", "Amigo añadido correctamente"));
    }

    @GetMapping("/friends")
    public ResponseEntity<?> getFriends(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null || user.getFriends() == null) return ResponseEntity.ok(List.of());

        List<User> amigos = userRepository.findAllById(user.getFriends());
        return ResponseEntity.ok(amigos);
    }
}