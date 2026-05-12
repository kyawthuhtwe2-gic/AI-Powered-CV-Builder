package com.gicjp.ai_powered_cv_builder.repository;

import com.gicjp.ai_powered_cv_builder.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CVRepository extends JpaRepository<CV, String> {

	java.util.List<com.gicjp.ai_powered_cv_builder.model.CV> findAllByOwner_Email(String ownerEmail);

}
