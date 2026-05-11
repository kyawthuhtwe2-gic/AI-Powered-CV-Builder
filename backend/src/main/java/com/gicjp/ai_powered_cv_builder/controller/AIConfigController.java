package com.gicjp.ai_powered_cv_builder.controller;

import com.gicjp.ai_powered_cv_builder.model.AIConfig;
import com.gicjp.ai_powered_cv_builder.service.AIConfigService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ais")
public class AIConfigController {

    private final AIConfigService aiConfigService;

    public AIConfigController(AIConfigService aiConfigService) {
        this.aiConfigService = aiConfigService;
    }

    @GetMapping
    public List<AIConfig> list() {
        String email = currentEmail();
        return aiConfigService.listByOwner(email);
    }

    @GetMapping("/{id}")
    public AIConfig get(@PathVariable Long id) {
        String email = currentEmail();
        AIConfig ai = aiConfigService.getById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI config not found"));
        if (ai.getOwner() == null || email == null || !email.equals(ai.getOwner().getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return ai;
    }

    @PostMapping
    public AIConfig create(@RequestBody AIConfig ai) {
        return aiConfigService.create(ai, currentEmail());
    }

    @PutMapping("/{id}")
    public AIConfig update(@PathVariable Long id, @RequestBody AIConfig ai) {
        try {
            return aiConfigService.update(id, ai, currentEmail());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        try {
            aiConfigService.delete(id, currentEmail());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    private String currentEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.gicjp.ai_powered_cv_builder.model.User) {
            return ((com.gicjp.ai_powered_cv_builder.model.User) principal).getEmail();
        }
        return principal != null ? principal.toString() : null;
    }
}
