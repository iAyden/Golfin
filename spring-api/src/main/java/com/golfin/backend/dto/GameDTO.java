package com.golfin.backend.dto;

import java.util.List;

public class GameDTO {
    private String id;
    private String course;
    private String winner;
    private int totalSpringedTraps;
    private int totalTime;
    private List<String> playerIds; // IDs en lugar de usernames
    private List<String> playerUsernames; // sigue viniendo como usernames

    public GameDTO() {}

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
    public List<String> getPlayerUsernames() {
    return playerUsernames;
}

    public void setPlayerUsernames(List<String> playerUsernames) {
    this.playerUsernames = playerUsernames;
    }
    public String getId(){
        return id;
    }

    public void setId(String id){
        this.id = id;
    }
}
