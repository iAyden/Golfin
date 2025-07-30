package com.golfin.backend.dto;

import com.golfin.backend.model.embedded.GameStats;
import java.util.List;

public class GameStatsDTO {

    private GameStats data;
    private List<String> playerUsernames;

    public GameStats getData() {
        return data;
    }

    public void setData(GameStats data) {
        this.data = data;
    }

    public List<String> getPlayerUsernames() {
        return playerUsernames;
    }

    public void setPlayerUsernames(List<String> playerUsernames) {
        this.playerUsernames = playerUsernames;
    }
}
