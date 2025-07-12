package com.golfin.backend.model;

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
    private int totalTime; // segundos
    private List<String> playerUsernames;

    public Game() {}

    public Game(String course, String winner, int totalSpringedTraps, int totalTime, List<String> playerUsernames) {
        this.course = course;
        this.winner = winner;
        this.totalSpringedTraps = totalSpringedTraps;
        this.totalTime = totalTime;
        this.playerUsernames = playerUsernames;
    }
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

    public List<String> getPlayerUsernames() {
        return playerUsernames;
    }

    public void setPlayerUsernames(List<String> playerUsernames) {
        this.playerUsernames = playerUsernames;
    }
}
