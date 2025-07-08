package com.golfin.backend.model.embedded;

public class Stats {
    private int totalGamesPlayed;
    private int totalBirdies;
    private int totalPars;
    private int totalBogeys;
    private double averageScore;
    private double overallPerformance;

    // Getters y Setters
    public int getTotalGamesPlayed() { return totalGamesPlayed; }
    public void setTotalGamesPlayed(int totalGamesPlayed) { this.totalGamesPlayed = totalGamesPlayed; }

    public int getTotalBirdies() { return totalBirdies; }
    public void setTotalBirdies(int totalBirdies) { this.totalBirdies = totalBirdies; }

    public int getTotalPars() { return totalPars; }
    public void setTotalPars(int totalPars) { this.totalPars = totalPars; }

    public int getTotalBogeys() { return totalBogeys; }
    public void setTotalBogeys(int totalBogeys) { this.totalBogeys = totalBogeys; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public double getOverallPerformance() { return overallPerformance; }
    public void setOverallPerformance(double overallPerformance) { this.overallPerformance = overallPerformance; }
}
