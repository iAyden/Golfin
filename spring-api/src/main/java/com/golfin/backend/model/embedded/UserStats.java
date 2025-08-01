package com.golfin.backend.model.embedded;

public class UserStats {

    private int position;
    private int shots;
    private int points;
    private int springedTraps;
    private int KarmaTrigger;
    private int KarmaSpent;
    private int won;
    

    public UserStats() {}

    public UserStats(int position, int shots, int points, int springedTraps,int KarmaTrigger, int KarmaSpent, int won) {
        this.position = position;
        this.shots = shots;
        this.points = points;
        this.springedTraps = springedTraps;
        this.KarmaTrigger = KarmaTrigger;
        this.KarmaSpent = KarmaSpent;
        this.won = won;
        
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getShots() {
        return shots;
    }

    public void setShots(int shots) {
        this.shots = shots;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public int getSpringedTraps() {
        return springedTraps;
    }       

    public void setSpringedTraps(int springedTraps) {
        this.springedTraps = springedTraps;
    }
    public int getKarmaTrigger(){
        return KarmaTrigger;
    }

    public void setKarmaTrigger(int KarmaTrigger){
        this.KarmaTrigger=KarmaTrigger;
    }

    public int getKarmaSpent(){
        return KarmaSpent;
    }

    public void setKarmaSpent(int KarmaSpent){
        this.KarmaSpent=KarmaSpent;
    }
    public int getWon() {
        return won;
    }

    public void setWon(int won) {
        this.won = won;
    }


}
