package com.golfin.backend.model.embedded;

import java.util.Date;

public class GameHistory {
    private String gameName;
    private Date datePlayed;
    private int score;
    private int trapsActivated;
    private int birdies;
    private int pars;
    private int bogeys;
    private double holePercentage;
    private double performance;

    // Getters y Setters
    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }

    public Date getDatePlayed() { return datePlayed; }
    public void setDatePlayed(Date datePlayed) { this.datePlayed = datePlayed; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTrapsActivated() { return trapsActivated; }
    public void setTrapsActivated(int trapsActivated) { this.trapsActivated = trapsActivated; }

    public int getBirdies() { return birdies; }
    public void setBirdies(int birdies) { this.birdies = birdies; }

    public int getPars() { return pars; }
    public void setPars(int pars) { this.pars = pars; }

    public int getBogeys() { return bogeys; }
    public void setBogeys(int bogeys) { this.bogeys = bogeys; }

    public double getHolePercentage() { return holePercentage; }
    public void setHolePercentage(double holePercentage) { this.holePercentage = holePercentage; }

    public double getPerformance() { return performance; }
    public void setPerformance(double performance) { this.performance = performance; }
}
