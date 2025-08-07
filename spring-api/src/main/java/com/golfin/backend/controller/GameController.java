package com.golfin.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.model.Game;
import com.golfin.backend.service.GameService;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.bson.Document;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private GameService gameService;

    @PostMapping("/add")
    public ResponseEntity<Game> addGame(@RequestBody GameDTO dto) {
        try {
            System.out.println("dto: " + objectMapper.writeValueAsString(dto));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        try {
            Game savedGame = gameService.saveGame(dto);
            return ResponseEntity.ok(savedGame);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }
    @PostMapping("/game-data")
    public ResponseEntity<?> getMultipleUserGameData(@RequestBody List<String> usernames) {
    List<UserGameDataDTO> gameDataList = usernames.stream()
        .map(username -> gameService.getGameDataForUsername(username)) // tu lógica
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

    return ResponseEntity.ok(gameDataList);
}


    @GetMapping("/with-players")
        public ResponseEntity<?> getGamesWithPlayerDetails() {
            List<Document> games = gameService.getGamesWithPlayerDetails();
            return ResponseEntity.ok(games);
        }

}
