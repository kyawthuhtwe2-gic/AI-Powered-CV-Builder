package com.gicjp.ai_powered_cv_builder.service;

import com.gicjp.ai_powered_cv_builder.model.CV;
import com.gicjp.ai_powered_cv_builder.model.User;
import com.gicjp.ai_powered_cv_builder.repository.CVRepository;
import com.gicjp.ai_powered_cv_builder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

@Service
public class CVService {

    private final CVRepository cvRepository;
    private final UserRepository userRepository;

    public CVService(CVRepository cvRepository, UserRepository userRepository) {
        this.cvRepository = cvRepository;
        this.userRepository = userRepository;
    }

    public List<CV> listAll() {
        return cvRepository.findAll();
    }

    public Page<CV> listByOwner(String ownerEmail, Pageable pageable) {
        return cvRepository.findAllByOwner_Email(ownerEmail, pageable);
    }

    public Optional<CV> getById(String id) {
        return cvRepository.findById(id);
    }

    public CV create(CV cv, String ownerEmail) {
        if (cv.getId() == null || cv.getId().isBlank()) {
            cv.setId(UUID.randomUUID().toString());
        }
        User owner = userRepository.findByEmail(ownerEmail).orElse(null);
        cv.setOwner(owner);
        return cvRepository.save(cv);
    }

    public CV update(String id, CV cv, String ownerEmail) {
        return cvRepository.findById(id).map(existing -> {
            if (existing.getOwner() == null || !ownerEmail.equals(existing.getOwner().getEmail())) {
                throw new IllegalArgumentException("Not allowed");
            }
            existing.setName(cv.getName());
            existing.setTemplateId(cv.getTemplateId());
            existing.setPersonalInfo(cv.getPersonalInfo());
            existing.setExperience(cv.getExperience());
            existing.setEducation(cv.getEducation());
            existing.setProjects(cv.getProjects());
            existing.setSkills(cv.getSkills());
            existing.setUpdatedAt(cv.getUpdatedAt());
            return cvRepository.save(existing);
        }).orElseGet(() -> {
            cv.setId(id);
            User owner = userRepository.findByEmail(ownerEmail).orElse(null);
            cv.setOwner(owner);
            return cvRepository.save(cv);
        });
    }

    public void delete(String id, String ownerEmail) {
        cvRepository.findById(id).ifPresent(existing -> {
            if (existing.getOwner() == null || !ownerEmail.equals(existing.getOwner().getEmail())) {
                throw new IllegalArgumentException("Not allowed");
            }
            cvRepository.deleteById(id);
        });
    }
}
