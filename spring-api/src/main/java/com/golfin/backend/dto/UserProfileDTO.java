package com.golfin.backend.dto;

import java.util.List;
import com.golfin.backend.model.embedded.*;
public class UserProfileDTO {
    private String id;
    private String username;
    private String email;
    private String photoUrl;
    private String role;
    private List<GameDTO> gameHistory;
    private List<Achievement> achievements;
    private UserStats stats;
    private List<String> friends;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<GameDTO> getGameHistory() { return gameHistory; }
    public void setGameHistory(List<GameDTO> gameHistory) { this.gameHistory = gameHistory; }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }

    public List<String> getFriends() { return friends; }
    public void setFriends(List<String> friends) { this.friends = friends; }

    public UserStats getStats() {
        return stats;
    }

    public void setStats(UserStats stats) {
        this.stats = stats;
    }
}
