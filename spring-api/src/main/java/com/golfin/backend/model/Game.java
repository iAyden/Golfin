package com.golfin.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.Date;

import java.util.List;

@Document
public class Game {

    @Id
    private String id;
    private String winner;
    private List<ObjectId> players;
    private String course;
    private int totalTime;
    private int totalSpringedTraps;
    private Date date;
    public Game() {}

    public Game(String id, String course, String winner, int totalSpringedTraps, int totalTime, List<ObjectId> players, Date date) {
        this.id = id;
        this.winner = winner;
        this.players=players;
        this.course = course;
        this.totalSpringedTraps = totalSpringedTraps;
        this.totalTime = totalTime;
        this.date = date;
       
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

    public List<ObjectId> getPlayers() {
        return players;
    }

    public void setPlayers(List<ObjectId> players) {
        this.players = players;
    }

    public Date getDate(){
        return date;
    }

    public void setDate(Date date){
        this.date=date;
    }
    
}
