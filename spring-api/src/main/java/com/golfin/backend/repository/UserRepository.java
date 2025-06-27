package com.golfin.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.golfin.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);

    User findByEmail(String email);
}
