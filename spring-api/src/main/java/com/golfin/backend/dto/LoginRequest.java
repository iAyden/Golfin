package com.golfin.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
//DTO DE ENTRADA PARA EL LOGIN
public class LoginRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    //GETTERS Y SETTERS
    public String getEmail() {return email; }
    public void setEmail(String email) {this.email=email;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password=password;}
}
