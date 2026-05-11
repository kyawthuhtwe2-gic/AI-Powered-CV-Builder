package com.gicjp.ai_powered_cv_builder.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CVDto {
    private Long id;
    private String name;
    private String templateId;
    private PersonalInfoDto personalInfo;
    private List<ExperienceDto> experience;
    private List<EducationDto> education;
    private List<ProjectDto> projects;
    private List<String> skills;
    private String createdAt;
    private String updatedAt;
    private String email;
}
