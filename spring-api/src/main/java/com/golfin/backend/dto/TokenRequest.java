package com.golfin.backend.dto;

public class TokenRequest {
    private String token;

    public TokenRequest(){

    }

    public String getToken(){
        return token;
    }
    
    public void setToken(String token){
        this.token=token;
    }
}
