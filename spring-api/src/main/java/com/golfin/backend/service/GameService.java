package com.golfin.backend.service;

import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.model.Game;
import com.golfin.backend.repository.GameRepository;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.model.User;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Service;
import org.bson.Document;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Game saveGame(GameDTO dto) {
        List<String> playerIds = dto.getPlayerUsernames()
            .stream()
            .map(username -> userRepository.findByUsername(username))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(User::getId)  // getId() devuelve String
            .collect(Collectors.toList());

        Game game = new Game(
            dto.getCourse(),
            dto.getWinner(),
            dto.getTotalSpringedTraps(),
            dto.getTotalTime(),
            playerIds  
        );

        return gameRepository.save(game);
    }



    public List<Document> getGamesWithPlayerDetails() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.lookup("users", "playerIds", "_id", "players") // lookup entre playerIds y users._id
        );

        return mongoTemplate.aggregate(aggregation, "games", Document.class).getMappedResults();
    }
}
