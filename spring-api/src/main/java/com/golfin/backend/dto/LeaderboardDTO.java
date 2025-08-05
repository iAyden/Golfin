package com.golfin.backend.dto;

public class LeaderboardDTO {
    private int position;
    private String username;
    private String photoURL;
    private int wins;

    public LeaderboardDTO(int position, String username, String photoURL, int wins) {
        this.position=position;
        this.username=username;
        this.photoURL=photoURL;
        this.wins=wins;
    }

    public int getPosition(){
        return position;
    }

    public void setPosition(int position){
        this.position=position;
    }
     public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username=username;
    }

    public String getPhotoURL(){
        return photoURL;
    }

    public void setPhotoURL(String photoURL){
        this.photoURL=photoURL;
    }
    
    public int getWins(){
        return wins;
    }

    public void setWins(int wins){
        this.wins=wins;
    }
}
