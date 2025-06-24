package com.golfin.backend.controller;

import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
@Controller
public class AuthController {
@PostMapping("/api/auth/google")

    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body){
        String idToken = body.get("token");
        return ResponseEntity.ok(null);   
    }
}
