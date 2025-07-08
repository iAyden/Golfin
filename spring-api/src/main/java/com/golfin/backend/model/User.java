package com.golfin.backend.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.golfin.backend.model.embedded.*;
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String photoUrl;       // de Google

    private String googleSub;      // ID único de Google (sub)
    private String authProvider;   // "LOCAL" o "GOOGLE"

    private String role = "USER";
    public User() {}

    private List<GameHistory> gameHistory = new ArrayList<>();
    private List<Achievement> achievements = new ArrayList<>();
    private List<String> friends = new ArrayList<>();
    private Stats stats;

    public User(String username, String email, String password) {
        // Agregar hasheo de la pswd 
        this.username = username;
        this.email = email;
        this.password = password;

    }

    // Getters and Setters


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }


    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }


    public String getUsername() { return this.username; }
    public void setUsername(String username ) { this.username = username; }

    public String getPswd() { return this.password; }

    public void setPassword(String password) {
       System.out.println("Hola desde set pswd en modelo de usuario");
        this.password = password;
    } 

    public String getphotoURL() {return photoUrl;}
    public void setphotoURL(String photoURL) {this.photoUrl =photoURL;}

    public String getgoogleSub() {return googleSub;}
    public void setgoogleSub(String googleSub) {this.googleSub = googleSub;}

    public String getauthProvider() {return authProvider;}
    public void setauthProvider(String authProvider) {this.authProvider = authProvider;}

    public List<GameHistory> getGameHistory() { return gameHistory; }
    public void setGameHistory(List<GameHistory> gameHistory) { this.gameHistory = gameHistory; }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }

    public List<String> getFriends() { return friends; }
    public void setFriends(List<String> friends) { this.friends = friends; }

    public Stats getStats() { return stats; }
    public void setStats(Stats stats) { this.stats = stats; }
}
