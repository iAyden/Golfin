package com.golfin.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // desactiva CSRF para APIs REST
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // permite login por Google sin auth
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
