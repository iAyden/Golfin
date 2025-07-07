package com.golfin.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final long jwtExpiration;
    private final String jwtSecret;
    public JwtUtil(@Value("${JWT_SECRET_KEY}") String jwtSecret,
                    @Value("${JWT_EXPIRATION}") long jwtExpiration){

        this.jwtExpiration = jwtExpiration;
        this.jwtSecret = jwtSecret;
        System.out.println("Jwtexp"+jwtExpiration);
        System.out.println("JwtSecret"+jwtSecret);
    }
 

    private Key getSignInKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String email){
        return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
    }

    public String extractEmail(String token){
        return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
    }

    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
            return true;
        }catch(JwtException e){
            return false;
        }
    }
}
