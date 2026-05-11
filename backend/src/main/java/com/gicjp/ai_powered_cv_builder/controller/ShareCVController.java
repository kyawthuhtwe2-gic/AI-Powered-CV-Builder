package com.gicjp.ai_powered_cv_builder.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gicjp.ai_powered_cv_builder.dto.CVDto;
import com.gicjp.ai_powered_cv_builder.model.CV;
import com.gicjp.ai_powered_cv_builder.service.CVService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cv/share")
public class ShareCVController {

    private final CVService cvService;
    private final ObjectMapper mapper;

    public ShareCVController(CVService cvService, ObjectMapper mapper) {
        this.cvService = cvService;
        this.mapper = mapper;
    }

    
        @GetMapping("/{id}")
        public CVDto getShared(@PathVariable String id) {
                CV cv = cvService.getById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CV not found"));
                return toDto(cv);
        }

    private CVDto toDto(CV cv) {
        try {
            CVDto dto = new CVDto();

            dto.setId(cv.getId());
            dto.setName(cv.getName());
            dto.setTemplateId(cv.getTemplateId());
            dto.setCreatedAt(cv.getCreatedAt());
            dto.setUpdatedAt(cv.getUpdatedAt());

            // FIX: safe parsing with fallback empty object
            dto.setPersonalInfo(
                    mapper.readValue(
                            cv.getPersonalInfo() == null ? "{}" : cv.getPersonalInfo(),
                            com.gicjp.ai_powered_cv_builder.dto.PersonalInfoDto.class));

            dto.setExperience(
                    mapper.readValue(
                            cv.getExperience() == null ? "[]" : cv.getExperience(),
                            mapper.getTypeFactory().constructCollectionType(
                                    java.util.List.class,
                                    com.gicjp.ai_powered_cv_builder.dto.ExperienceDto.class)));

            dto.setEducation(
                    mapper.readValue(
                            cv.getEducation() == null ? "[]" : cv.getEducation(),
                            mapper.getTypeFactory().constructCollectionType(
                                    java.util.List.class,
                                    com.gicjp.ai_powered_cv_builder.dto.EducationDto.class)));

            dto.setProjects(
                    mapper.readValue(
                            cv.getProjects() == null ? "[]" : cv.getProjects(),
                            mapper.getTypeFactory().constructCollectionType(
                                    java.util.List.class,
                                    com.gicjp.ai_powered_cv_builder.dto.ProjectDto.class)));

            dto.setSkills(
                    mapper.readValue(
                            cv.getSkills() == null ? "[]" : cv.getSkills(),
                            mapper.getTypeFactory().constructCollectionType(
                                    java.util.List.class,
                                    String.class)));

            dto.setEmail(
                    cv.getOwner() != null ? cv.getOwner().getEmail() : null);

            return dto;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("CV JSON parsing failed", e);
        }
    }
}
