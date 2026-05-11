package com.gicjp.ai_powered_cv_builder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gicjp.ai_powered_cv_builder.dto.AIRequest;
import com.gicjp.ai_powered_cv_builder.dto.CVDto;
import com.gicjp.ai_powered_cv_builder.service.AIService;

@RestController
@RequestMapping("api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/assist")
    public ResponseEntity<CVDto> assist(@RequestBody AIRequest request) {
        CVDto cvDto = aiService.assistToDto(request.getCvData(), request.getApiKey(), request.getInstruction());
        return ResponseEntity.ok(cvDto);
    }
}
