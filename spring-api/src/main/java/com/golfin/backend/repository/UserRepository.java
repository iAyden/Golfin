package com.golfin.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.golfin.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    User findByEmail(String email);

    User findByUsername(String username);
}
