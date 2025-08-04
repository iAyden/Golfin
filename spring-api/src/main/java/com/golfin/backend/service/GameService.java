package com.golfin.backend.service;

import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.model.Game;
import com.golfin.backend.repository.GameRepository;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.model.User;
import com.golfin.backend.model.embedded.GameHistory;

import java.util.Date;
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
        List<ObjectId> playerIds = dto.getPlayers()
            .stream()
            .map(userDto -> userRepository.findByUsername(userDto.getUsername()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> new ObjectId(user.getId()))
            .collect(Collectors.toList());
    
        Game game = new Game(
            dto.getId(),dto.getCourse(),
            dto.getWinner(), dto.getTotalSpringedTraps(),
            dto.getTotalTime(),playerIds,new Date()
            
         
            
        );
        // GameHistory history = new GameHistory();
        //     history.setId(game.getId());
        // for (ObjectId playerId : game.getPlayers()) {
        //     Optional<User> userOptional = userRepository.findById(playerId);
        //     if (userOptional.isPresent()) {
        //         User user = userOptional.get();
        //         user.getGameHistory().add(history);
        //         userRepository.save(user);
        //     }
        // }
        return gameRepository.save(game);
    }
    public List<String> getUsernamesFromGame(Game game) {
    return game.getPlayers().stream()
        .map(userRepository::findById)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(User::getUsername)
        .collect(Collectors.toList());
    }




    public List<Document> getGamesWithPlayerDetails() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.lookup("users", "playerIds", "_id", "players") // lookup entre playerIds y users._id
        );

        return mongoTemplate.aggregate(aggregation, "games", Document.class).getMappedResults();
    }
}
