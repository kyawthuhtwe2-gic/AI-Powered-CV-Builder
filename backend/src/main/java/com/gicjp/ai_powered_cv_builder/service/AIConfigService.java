package com.gicjp.ai_powered_cv_builder.service;

import com.gicjp.ai_powered_cv_builder.model.AIConfig;
import com.gicjp.ai_powered_cv_builder.model.User;
import com.gicjp.ai_powered_cv_builder.repository.AIConfigRepository;
import com.gicjp.ai_powered_cv_builder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AIConfigService {

    private final AIConfigRepository aiConfigRepository;
    private final UserRepository userRepository;

    public AIConfigService(AIConfigRepository aiConfigRepository, UserRepository userRepository) {
        this.aiConfigRepository = aiConfigRepository;
        this.userRepository = userRepository;
    }

    public List<AIConfig> listByOwner(String ownerEmail) {
        return aiConfigRepository.findAllByOwner_Email(ownerEmail);
    }

    public Optional<AIConfig> getById(Long id) {
        return aiConfigRepository.findById(id);
    }

    public AIConfig create(AIConfig ai, String ownerEmail) {
        if (ownerEmail != null) {
            User owner = userRepository.findByEmail(ownerEmail).orElse(null);
            ai.setOwner(owner);
        }
        return aiConfigRepository.save(ai);
    }

    public AIConfig update(Long id, AIConfig aiUpdate, String ownerEmail) {
        AIConfig existing = aiConfigRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
        if (existing.getOwner() != null && (ownerEmail == null || !ownerEmail.equals(existing.getOwner().getEmail()))) {
            throw new IllegalArgumentException("Forbidden");
        }

        existing.setInstruction(aiUpdate.getInstruction());
        // Only update key if provided
        if (aiUpdate.getOpenAiKey() != null) {
            existing.setOpenAiKey(aiUpdate.getOpenAiKey());
        }

        return aiConfigRepository.save(existing);
    }

    public void delete(Long id, String ownerEmail) {
        AIConfig existing = aiConfigRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
        if (existing.getOwner() != null && (ownerEmail == null || !ownerEmail.equals(existing.getOwner().getEmail()))) {
            throw new IllegalArgumentException("Forbidden");
        }
        aiConfigRepository.deleteById(id);
    }
}
