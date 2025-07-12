package com.golfin.backend.service;

import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.model.Game;
import com.golfin.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public Game saveGame(GameDTO dto) {
        Game game = new Game(
            dto.getCourse(),
            dto.getWinner(),
            dto.getTotalSpringedTraps(),
            dto.getTotalTime(),
            dto.getPlayerUsernames()
        );
        return gameRepository.save(game);
    }
}
