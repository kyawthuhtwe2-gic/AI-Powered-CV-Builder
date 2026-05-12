package com.gicjp.ai_powered_cv_builder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gicjp.ai_powered_cv_builder.dto.CVDto;
import com.gicjp.ai_powered_cv_builder.dto.PersonalInfoDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class AIService {

        private final RestTemplate restTemplate = new RestTemplate();
        private final ObjectMapper objectMapper = new ObjectMapper();

        private static final int MAX_FIELD_CHARS = 2000;
        private static final int MAX_LIST_ITEMS = 10;

        @SuppressWarnings("unchecked")
        private Object reduceObject(Object obj) {
                if (obj instanceof Map<?, ?> map) {
                        Map<String, Object> out = new HashMap<>();
                        for (Map.Entry<?, ?> e : map.entrySet()) {
                                out.put(String.valueOf(e.getKey()), reduceObject(e.getValue()));
                        }
                        return out;
                }

                if (obj instanceof List<?> list) {
                        List<Object> out = new ArrayList<>();
                        int i = 0;
                        for (Object item : list) {
                                if (i++ >= MAX_LIST_ITEMS)
                                        break;
                                out.add(reduceObject(item));
                        }
                        return out;
                }

                if (obj instanceof String s) {
                        return s.length() > MAX_FIELD_CHARS
                                        ? s.substring(0, MAX_FIELD_CHARS) + "..."
                                        : s;
                }

                return obj;
        }

        @SuppressWarnings("unchecked")
        private Map<String, Object> reduceForPrompt(Map<String, Object> input) {
                if (input == null)
                        return null;
                return (Map<String, Object>) reduceObject(input);
        }

        /**
         * OpenAI CALL
         */
        public String assist(
                        Map<String, Object> cvData,
                        String apiKey,
                        String instruction) {

                if (apiKey == null || apiKey.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OpenAI API Key is required");
                }

                try {

                        String prompt = String.format("""

                                        %s

                                        IMPORTANT RULES:

                                        - Only modify:
                                          1. summary
                                          2. description (experience/project descriptions)

                                        - DO NOT modify:
                                          name, email, phone, address,
                                          education, skills, dates,
                                          company names, project names,
                                          id, profileImage

                                        - Return ONLY valid JSON
                                        - Keep original structure
                                        - No markdown
                                        - No explanation

                                        CV DATA:
                                        %s

                                        """,
                                        instruction,
                                        objectMapper.writerWithDefaultPrettyPrinter()
                                                        .writeValueAsString(reduceForPrompt(cvData)));

                        String url = "https://api.openai.com/v1/chat/completions";

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        headers.setBearerAuth(apiKey);

                        Map<String, Object> requestBody = new HashMap<>();

                        requestBody.put("model", "gpt-4o-mini");

                        requestBody.put("messages", List.of(
                                        Map.of(
                                                        "role", "system",
                                                        "content",
                                                        """
                                                                        You are an expert ATS CV writer.

                                                                        STRICT RULES:
                                                                        - Modify ONLY summary and description fields
                                                                        - Never change structure
                                                                        - Never change id or profileImage
                                                                        - Return ONLY raw JSON
                                                                        - No markdown
                                                                        - No explanation
                                                                        """),

                                        Map.of(
                                                        "role", "user",
                                                        "content", prompt)));

                        requestBody.put("temperature", 0.7);
                        requestBody.put("max_tokens", 2000);

                        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

                        if (!response.getStatusCode().is2xxSuccessful()) {
                                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "OpenAI API Error");
                        }

                        Map<String, Object> body = response.getBody();

                        if (body == null) {
                                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Empty OpenAI response");
                        }

                        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");

                        if (choices == null || choices.isEmpty()) {
                                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "No AI choices returned");
                        }

                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

                        if (message == null || message.get("content") == null) {
                                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Invalid AI response");
                        }

                        return message.get("content").toString();

                } catch (Exception ex) {
                        throw new ResponseStatusException(
                                        HttpStatus.INTERNAL_SERVER_ERROR,
                                        "Failed to connect OpenAI API: " + ex.getMessage());
                }
        }

        /**
         * Convert AI response → CVDto
         */
        public CVDto assistToDto(
                        Map<String, Object> cvData,
                        String apiKey,
                        String instruction) {

                try {

                        System.out.println("OpenAI Start");

                        if (apiKey == null || apiKey.isBlank()) {
                                return objectMapper.convertValue(cvData, CVDto.class);
                        }

                        String aiResponse = assist(cvData, apiKey, instruction);

                        System.out.println("AI Response:");
                        System.out.println(aiResponse);

                        aiResponse = aiResponse
                                        .replace("```json", "")
                                        .replace("```", "")
                                        .trim();

                        CVDto parsed = objectMapper.readValue(aiResponse, CVDto.class);

                        // Preserve ID
                        if (cvData.get("id") != null) {
                                parsed.setId(String.valueOf(cvData.get("id")));
                        }

                        // Preserve profile image
                        Object personal = cvData.get("personalInfo");
                        if (personal instanceof Map<?, ?> map) {
                                Object profileImage = map.get("profileImage");

                                if (profileImage != null) {
                                        if (parsed.getPersonalInfo() == null) {
                                                parsed.setPersonalInfo(new PersonalInfoDto());
                                        }
                                        parsed.getPersonalInfo()
                                                        .setProfileImage(String.valueOf(profileImage));
                                }
                        }

                        return parsed;

                } catch (Exception ex) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Failed to parse AI response to CVDto: " + ex.getMessage());
                }
        }
}