package com.golfin.backend.controller;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.golfin.backend.dto.LoginRequest;
import com.golfin.backend.dto.LoginResponse;
import com.golfin.backend.dto.SignupDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.security.JwtUtil;
import com.golfin.backend.util.PasswordUtil;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("entrando al endpoint de login con email " + loginRequest.getEmail());
        User userData = userRepository.findByEmail(loginRequest.getEmail());
        
        if(userData != null && PasswordUtil.matches(loginRequest.getPassword(),userData.getPswd())){ 
            String jwt = jwtUtil.generateToken(userData.getEmail());
            if(jwt==null || jwt.isEmpty()){
                System.out.println("Falló el jwt");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","No se pudo generar el jwt"));
            }
            LoginResponse loginResponse = new LoginResponse(userData.getUsername(), userData.getEmail(), jwt);
            return ResponseEntity.ok(loginResponse);
            }
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error","Correo o Contraseña Invalidos"));
    } 
    

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@Valid @RequestBody SignupDTO signupDTO) {

        if (userRepository.existsByEmail(signupDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body
            (Map.of("error","Email ya en uso."));
        }
        if(userRepository.existsByUsername(signupDTO.getUsername())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body
            (Map.of("error","Username ya en uso"));
        }
        User newUser = new User();
        newUser.setEmail(signupDTO.getEmail());
        newUser.setUsername(signupDTO.getUsername());
        newUser.setPassword(PasswordUtil.hash(signupDTO.getPassword()))  ;
        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado con exito.");
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body){
        String idTokeString = body.get("id:token");
        if(idTokeString == null || idTokeString.isEmpty()){
            return ResponseEntity.badRequest().body(Map.of("error","id_token es requerido"));
        }
        return ResponseEntity.ok(null);
    }
}
