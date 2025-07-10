package com.golfin.backend.dto;

public class GameHistoryDTO {
    private String gameName;
    private String date;
    private int score;
    private int trapsActivated;
    private int birdies;
    private int pars;
    private int bogeys;
    private double percentageScored;
    private double performance;

    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

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

    public double getPercentageScored() { return percentageScored; }
    public void setPercentageScored(double percentageScored) { this.percentageScored = percentageScored; }

    public double getPerformance() { return performance; }
    public void setPerformance(double performance) { this.performance = performance; }
}