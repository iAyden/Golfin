package com.golfin.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import com.golfin.backend.model.User;
import java.util.Optional;
public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    User findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findById(ObjectId Id);

    User findByGoogleSub(String googleSub);
}
