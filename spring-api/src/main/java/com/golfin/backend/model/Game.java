package com.golfin.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document
public class Game {

    @Id
    private String id;
    private String winner;
    private List<String> players;
    private String course;
    private int totalTime;
    private int totalSpringedTraps;
    public Game() {}

    public Game(String id, String course, String winner, int totalSpringedTraps, int totalTime, List<String> players) {
        this.id = id;
        this.winner = winner;
        this.players=players;
        this.course = course;
        this.totalTime = totalTime;
        this.totalSpringedTraps = totalSpringedTraps;
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

    public List<String> getPlayers() {
        return players;
    }

    public void setPlayers(List<String> players) {
        this.players = players;
    }
    
}
