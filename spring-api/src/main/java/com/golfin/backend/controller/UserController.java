package com.golfin.backend.controller;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.golfin.backend.repository.GameRepository;
import com.golfin.backend.repository.UserRepository;
import com.golfin.backend.security.JwtUtil;
import com.golfin.backend.dto.GameDTO;
import com.golfin.backend.dto.UserGameStatsDTO;
import com.golfin.backend.dto.UserProfileDTO;
import com.golfin.backend.dto.UserStatsDTO;
import com.golfin.backend.model.User;
import com.golfin.backend.model.embedded.Achievement;
import com.golfin.backend.model.embedded.GameHistory;
import com.golfin.backend.model.embedded.UserStats;
import com.golfin.backend.model.Game;
import java.util.*;
import java.util.stream.Collectors;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final GameRepository gameRepository;

    public UserController(UserRepository userRepository, JwtUtil jwtUtil, GameRepository gameRepository){
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.gameRepository = gameRepository;
    }

   @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader){
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falta-token");
    }

    String token = authHeader.substring(7);
    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalido");
    }

    String email = jwtUtil.extractEmail(token);
    User user = userRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
    List<String> gameIds = user.getGameHistory().stream().map(GameHistory::getId).toList();
    List<Game> games = gameRepository.findByIdIn(gameIds);

    Set<ObjectId> allPlayerIds = new HashSet<>();
    for (Game game : games) {
        allPlayerIds.addAll(game.getPlayers()); 
    }

    List<User> players = userRepository.findByIdIn(new ArrayList<>(allPlayerIds));
    Map<String, String> idToUsername = new HashMap<>();
    for (User u : players) {
        idToUsername.put(u.getId(), u.getUsername());
    }
    List<GameDTO> gameDTOs = new ArrayList<>();
    for (Game game : games) {
        List<UserGameStatsDTO> playersDTOs = game.getPlayers().stream()
        .map(ObjectId::toHexString)
        .map(idToUsername::get)
        .filter(Objects::nonNull)
        .map(username -> new UserGameStatsDTO(user.getUsername()))
        .collect(Collectors.toList());

        GameDTO gameDTO = new GameDTO();
        gameDTO.setId(game.getId());
        gameDTO.setCourse(game.getCourse());
        gameDTO.setWinner(game.getWinner());
        gameDTO.setTotalSpringedTraps(game.getTotalSpringedTraps());
        gameDTO.setTotalTime(game.getTotalTime());
        gameDTO.setPlayers(playersDTOs);

        gameDTOs.add(gameDTO);
    }

    UserProfileDTO dto = new UserProfileDTO();
    dto.setUsername(user.getUsername());
    dto.setEmail(user.getEmail());
    dto.setPhotoUrl(user.getphotoURL());
    dto.setAchievements(user.getAchievements());
    dto.setGameHistory(gameDTOs);
    dto.setFriends(user.getFriends());
    
    dto.setStats(user.getStats());
    return ResponseEntity.ok(dto);
    }

    //este endpoint va a recibir el objeto cuando termine una partida para añadir a su historial
    @PostMapping("/add-game")
    public ResponseEntity<?> addGame(@RequestHeader("Authorization") String authHeader,
                                     @RequestBody GameHistory game) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        if (user.getGameHistory() == null) user.setGameHistory(new ArrayList<>());
        user.getGameHistory().add(game);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Partida añadida correctamente"));
    }

    @PostMapping("/add-achievement")
    public ResponseEntity<?> addAchievement(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody Achievement achievement) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        if (user.getAchievements() == null) user.setAchievements(new ArrayList<>());
        user.getAchievements().add(achievement);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Logro añadido correctamente"));
    }

    @PostMapping("/add-friend")
    public ResponseEntity<?> addFriend(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody Map<String, String> body) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();

        String friendId = body.get("friendId");
        if (friendId == null) return ResponseEntity.badRequest().body("Falta friendId");

        if (user.getFriends() == null) user.setFriends(new ArrayList<>());
        if (!user.getFriends().contains(friendId)) {
            user.getFriends().add(friendId);
            userRepository.save(user);
        }
        return ResponseEntity.ok(Map.of("message", "Amigo añadido correctamente"));
    }
   

    @GetMapping("/friends")
    public ResponseEntity<?> getFriends(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email);
        if (user == null || user.getFriends() == null) return ResponseEntity.ok(List.of());

        List<User> amigos = userRepository.findAllById(user.getFriends());
        return ResponseEntity.ok(amigos);
    }
}