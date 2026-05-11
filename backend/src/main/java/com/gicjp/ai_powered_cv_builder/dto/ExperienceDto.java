package com.gicjp.ai_powered_cv_builder.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDto {
    private String id;
    private String company;
    private String position;
    private String startDate;
    private String endDate;
    private String description;
}
