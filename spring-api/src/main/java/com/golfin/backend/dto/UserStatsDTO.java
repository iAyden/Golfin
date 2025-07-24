package com.golfin.backend.dto;

import com.golfin.backend.model.embedded.UserStats;

public class UserStatsDTO {
    private String username;
    private UserStats data;

    public UserStatsDTO() {}

    public UserStatsDTO(String username, UserStats data) {
        this.username = username;
        this.data = data;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserStats getData() {
        return data;
    }

    public void setData(UserStats data) {
        this.data = data;
    }
}
