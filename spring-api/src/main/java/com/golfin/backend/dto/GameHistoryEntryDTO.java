package com.golfin.backend.dto;
import com.golfin.backend.model.embedded.*;
public class GameHistoryEntryDTO {
    private GameDTO game;
    private UserStats userStats;

    public GameHistoryEntryDTO(GameDTO game, UserStats userStats) {
        this.game = game;
        this.userStats = userStats;
    }

    public GameDTO getGame() {
        return game;
    }

    public void setGame(GameDTO game) {
        this.game = game;
    }

    public UserStats getUserStats() {
        return userStats;
    }

    public void setUserStats(UserStats userStats) {
        this.userStats = userStats;
    }
}
