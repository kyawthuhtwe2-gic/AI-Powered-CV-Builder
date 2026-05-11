package com.gicjp.ai_powered_cv_builder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfoDto {
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String profileImage;
}
