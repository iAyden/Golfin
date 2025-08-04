package com.golfin.backend.model.embedded;



public class GameHistory {
    private String id;
    private UserStats stats; 
    // private String gameName;
    // private Date datePlayed;
    // private int score;
    // private int trapsActivated;
    // private int birdies;
    // private int pars;
    // private int bogeys;
    // private double holePercentage;
    // private double performance;
    
    public String getId() {return id;}
    public void setId(String id ) {this.id = id;}

    public UserStats getUserStats() {return stats;}
    public void setUserStats(UserStats stats) {this.stats=stats;}
    // public String getGameName() { return gameName; }
    // public void setGameName(String gameName) { this.gameName = gameName; }

    // public Date getDatePlayed() { return datePlayed; }
    // public void setDatePlayed(Date datePlayed) { this.datePlayed = datePlayed; }

    // public int getScore() { return score; }
    // public void setScore(int score) { this.score = score; }

    // public int getTrapsActivated() { return trapsActivated; }
    // public void setTrapsActivated(int trapsActivated) { this.trapsActivated = trapsActivated; }

    // public int getBirdies() { return birdies; }
    // public void setBirdies(int birdies) { this.birdies = birdies; }

    // public int getPars() { return pars; }
    // public void setPars(int pars) { this.pars = pars; }

    // public int getBogeys() { return bogeys; }
    // public void setBogeys(int bogeys) { this.bogeys = bogeys; }

    // public double getHolePercentage() { return holePercentage; }
    // public void setHolePercentage(double holePercentage) { this.holePercentage = holePercentage; }

    // public double getPerformance() { return performance; }
    // public void setPerformance(double performance) { this.performance = performance; }
}
