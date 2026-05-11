package com.gicjp.ai_powered_cv_builder.dto;

import java.util.Map;

public class AIRequest {
    private Map<String, Object> cvData;
    private String apiKey;
    private String instruction;

    public AIRequest() {
    }

    public Map<String, Object> getCvData() {
        return cvData;
    }

    public void setCvData(Map<String, Object> cvData) {
        this.cvData = cvData;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }
}
