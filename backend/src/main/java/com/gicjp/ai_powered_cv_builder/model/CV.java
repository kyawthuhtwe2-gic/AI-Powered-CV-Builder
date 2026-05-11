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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String name;

    private String templateId;

    @Lob
    private String personalInfo; // stored as JSON string

    @Lob
    private String experience; // stored as JSON string (array)

    @Lob
    private String education; // stored as JSON string (array)

    @Lob
    private String projects; // stored as JSON string (array)

    @Lob
    private String skills; // stored as JSON string (array)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    private String createdAt;

    private String updatedAt;
}
