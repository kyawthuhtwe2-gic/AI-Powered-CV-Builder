package com.gicjp.ai_powered_cv_builder.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cvs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CV {

    @Id
    private String id;

    private String name;

    private String templateId;

    @Lob
    private String personalInfo;

    @Lob
    private String experience;

    @Lob
    private String education;

    @Lob
    private String projects;

    @Lob
    private String skills;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    private String createdAt;

    private String updatedAt;
}
