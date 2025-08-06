package com.golfin.backend.model.embedded;



public class GameHistory {
    private String id;
    private UserStats stats; 

    public String getId() {return id;}
    public void setId(String id ) {this.id = id;}

    public UserStats getUserStats() {return stats;}
    public void setUserStats(UserStats stats) {this.stats=stats;}

}
