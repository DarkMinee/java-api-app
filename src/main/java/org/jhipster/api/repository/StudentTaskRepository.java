package org.jhipster.api.repository;

import org.jhipster.api.domain.StudentTask;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentTaskRepository extends JpaRepository<StudentTask, Long> {}
