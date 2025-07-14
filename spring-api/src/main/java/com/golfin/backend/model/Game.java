package com.golfin.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "games")
public class Game {

    @Id
    private String id;

    private String course;
    private String winner;
    private int totalSpringedTraps;
    private int totalTime;
    // Reemplazamos los usernames con los ObjectIds
    private List<String> playerIds;

    public Game() {}
    public Game(String course, String winner, int totalSpringedTraps, int totalTime, List<String> playerIds) {
        this.course = course;
        this.winner = winner;
        this.totalSpringedTraps = totalSpringedTraps;
        this.totalTime = totalTime;
        this.playerIds = playerIds;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public int getTotalSpringedTraps() {
        return totalSpringedTraps;
    }

    public void setTotalSpringedTraps(int totalSpringedTraps) {
        this.totalSpringedTraps = totalSpringedTraps;
    }

    public int getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(int totalTime) {
        this.totalTime = totalTime;
    }

    public List<String> getPlayerIds() {
        return playerIds;
    }

    public void setPlayerIds(List<String> playerIds) {
        this.playerIds = playerIds;
    }
}

