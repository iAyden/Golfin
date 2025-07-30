package com.golfin.backend.controller;

import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.model.Game;
import com.golfin.backend.service.GameService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.bson.Document;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/add")
    public ResponseEntity<Game> addGame(@RequestBody GameDTO dto) {
        try {
            Game savedGame = gameService.saveGame(dto);
            return ResponseEntity.ok(savedGame);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }

            @GetMapping("/with-players")
        public ResponseEntity<?> getGamesWithPlayerDetails() {
            List<Document> games = gameService.getGamesWithPlayerDetails();
            return ResponseEntity.ok(games);
        }

}
