package com.gicjp.ai_powered_cv_builder.repository;

import com.gicjp.ai_powered_cv_builder.model.AIConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIConfigRepository extends JpaRepository<AIConfig, Long> {
    List<AIConfig> findAllByOwner_Email(String ownerEmail);
}
