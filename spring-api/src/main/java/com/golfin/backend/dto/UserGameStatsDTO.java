package com.golfin.backend.dto;


public class UserGameStatsDTO {
    private String username;

    public UserGameStatsDTO() {}

    public UserGameStatsDTO(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
