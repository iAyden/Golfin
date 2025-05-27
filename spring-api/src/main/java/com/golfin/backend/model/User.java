package com.golfin.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String username;
    private String pswd;

    public User() {}

    public User(String name, String email, String username, String pswd) {
        // Agregar hasheo de la pswd 
        this.name = name;
        this.email = email;
        this.username = username;
        this.pswd = pswd;

    }

    // Getters and Setters


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }


    public String getUsername() { return this.username; }
    public void setUsername(String username ) { this.username = username; }

    public String getPswd() { return this.pswd; }

    public void setPswd(String pswd) {
       System.out.println("Hola desde set pswd en modelo de usuario");
        this.pswd = pswd;
        
        
        
        
    } 
    

}
