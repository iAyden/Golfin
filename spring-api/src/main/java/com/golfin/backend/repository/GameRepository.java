package com.golfin.backend.repository;

import com.golfin.backend.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {

    // Buscar todos los juegos donde un jugador participó
    List<Game> findByplayersContaining(String players);


    List<Game> findByWinner(String winner);     //Buscar juegos ganados por un jugador

    // List<Game> findByPlayerIdsContaining(String playerId);

}
