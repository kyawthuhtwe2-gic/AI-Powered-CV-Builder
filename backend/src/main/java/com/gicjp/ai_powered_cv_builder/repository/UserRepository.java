package com.gicjp.ai_powered_cv_builder.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gicjp.ai_powered_cv_builder.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}