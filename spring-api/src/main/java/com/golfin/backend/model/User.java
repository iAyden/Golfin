package com.golfin.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;

    public User() {}

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
}
