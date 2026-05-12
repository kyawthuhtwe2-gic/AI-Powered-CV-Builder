package com.gicjp.ai_powered_cv_builder.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gicjp.ai_powered_cv_builder.dto.CVDto;
import com.gicjp.ai_powered_cv_builder.model.CV;
import com.gicjp.ai_powered_cv_builder.model.User;
import com.gicjp.ai_powered_cv_builder.service.CVService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;

@RestController
@RequestMapping("api/cvs")
public class CVController {

    private final CVService cvService;
    private final ObjectMapper mapper;

    public CVController(CVService cvService, ObjectMapper mapper) {
        this.cvService = cvService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<CVDto> list() {
        String email = currentEmail();
        return cvService.listByOwner(email).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public CVDto get(@PathVariable String id) {
        String email = currentEmail();
        CV cv = cvService.getById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CV not found"));
        if (cv.getOwner() == null || email == null || !email.equals(cv.getOwner().getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return toDto(cv);
    }

    @GetMapping("/share/{id}")
    public CVDto getShared(@PathVariable String id) {
        CV cv = cvService.getById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CV not found"));
        return toDto(cv);
    }

    @PostMapping
    public CVDto create(@RequestBody CVDto cvDto) {
        try {
            CV entity = toEntity(cvDto, null);
            CV created = cvService.create(entity, currentEmail());
            return toDto(created);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CV payload");
        }
    }

    @PutMapping("/{id}")
    public CVDto update(@PathVariable String id, @RequestBody CVDto cvDto) {
        try {
            CV entity = toEntity(cvDto, id);
            CV updated = cvService.update(id, entity, currentEmail());
            return toDto(updated);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CV payload");
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        try {
            cvService.delete(id, currentEmail());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    private String currentEmail() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user.getEmail();
        }

        if (principal instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        }

        return null;
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

    private CV toEntity(CVDto dto, String id) throws JsonProcessingException {
        CV cv = new CV();
        if (id != null)
            cv.setId(id);
        else
            cv.setId(dto.getId());
        cv.setName(dto.getName());
        cv.setTemplateId(dto.getTemplateId());
        cv.setCreatedAt(dto.getCreatedAt());
        cv.setUpdatedAt(dto.getUpdatedAt());
        cv.setPersonalInfo(mapper.writeValueAsString(
                dto.getPersonalInfo() == null ? java.util.Collections.emptyMap() : dto.getPersonalInfo()));
        cv.setExperience(
                mapper.writeValueAsString(dto.getExperience() == null ? java.util.List.of() : dto.getExperience()));
        cv.setEducation(
                mapper.writeValueAsString(dto.getEducation() == null ? java.util.List.of() : dto.getEducation()));
        cv.setProjects(mapper.writeValueAsString(dto.getProjects() == null ? java.util.List.of() : dto.getProjects()));
        cv.setSkills(mapper.writeValueAsString(dto.getSkills() == null ? java.util.List.of() : dto.getSkills()));
        return cv;
    }
}
