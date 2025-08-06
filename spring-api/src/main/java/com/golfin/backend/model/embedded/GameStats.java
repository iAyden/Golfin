package com.golfin.backend.model.embedded;

public class GameStats {
       private int gameId;
    private String winner;
    private String course;
    private int timeElapsed;
    private int totalSpringedTraps;

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public int getTimeElapsed() {
        return timeElapsed;
    }

    public void setTimeElapsed(int timeElapsed) {
        this.timeElapsed = timeElapsed;
    }

    public int getTotalSpringedTraps() {
        return totalSpringedTraps;
    }

    public void setTotalSpringedTraps(int totalSpringedTraps) {
        this.totalSpringedTraps = totalSpringedTraps;
    }
}
