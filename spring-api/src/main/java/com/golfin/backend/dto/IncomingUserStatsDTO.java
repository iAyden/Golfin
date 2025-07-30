package com.golfin.backend.dto;

public class IncomingUserStatsDTO {

    private String username;
    private UserStatsDTO data;

    public IncomingUserStatsDTO() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserStatsDTO getData() {
        return data;
    }

    public void setData(UserStatsDTO data) {
        this.data = data;
    }
}
