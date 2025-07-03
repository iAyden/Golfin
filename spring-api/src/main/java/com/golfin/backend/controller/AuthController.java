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
import com.golfin.backend.dto.TokenRequest;
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
import com.google.api.client.json.jackson2.JacksonFactory;
import java.util.Collections;

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
            System.out.println("JWT: "+jwt);
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
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
    String idTokenString = body.get("id_token"); // usa el nombre correcto
    if (idTokenString == null || idTokenString.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "id_token es requerido"));
    }

    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance()
        )
        .setAudience(Collections.singletonList("467124897071-etfu4to0fh6i2rcpgvol7f15m5cdnthj.apps.googleusercontent.com"))
        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token inválido"));
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        String googleSub = payload.getSubject();

        User user = userRepository.findByGoogleSub(googleSub);
        if (user == null) {
            // intenta buscar por email para evitar duplicados
            user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setUsername(name);
                user.setEmail(email);
                user.setphotoURL(picture);
                user.setgoogleSub(googleSub);
                user.setauthProvider("GOOGLE");
                userRepository.save(user);
            }
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "email", user.getEmail(),
            "photoUrl", user.getphotoURL(),
            "token", token
        ));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Fallo autenticación con Google"));
    }
}


    @PostMapping("/validate")
    public ResponseEntity<?> jwtValidate(@RequestBody TokenRequest tokenRequest){
        String token = tokenRequest.getToken();
            try{
            boolean isValid = jwtUtil.validateToken(token);
            if(isValid){
                return ResponseEntity.ok("token valido");
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","token invalido"));
            }
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "error bad request desde jwtValidate"));
        }
    }
}
