package org.jhipster.api.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.api.domain.StudentTask;
import org.jhipster.api.repository.StudentTaskRepository;
import org.jhipster.api.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.api.domain.StudentTask}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StudentTaskResource {

    private final Logger log = LoggerFactory.getLogger(StudentTaskResource.class);

    private static final String ENTITY_NAME = "studentTask";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentTaskRepository studentTaskRepository;

    public StudentTaskResource(StudentTaskRepository studentTaskRepository) {
        this.studentTaskRepository = studentTaskRepository;
    }

    /**
     * {@code POST  /student-tasks} : Create a new studentTask.
     *
     * @param studentTask the studentTask to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentTask, or with status {@code 400 (Bad Request)} if the studentTask has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/student-tasks")
    public ResponseEntity<StudentTask> createStudentTask(@RequestBody StudentTask studentTask) throws URISyntaxException {
        log.debug("REST request to save StudentTask : {}", studentTask);
        if (studentTask.getId() != null) {
            throw new BadRequestAlertException("A new studentTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StudentTask result = studentTaskRepository.save(studentTask);
        return ResponseEntity
            .created(new URI("/api/student-tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /student-tasks/:id} : Updates an existing studentTask.
     *
     * @param id the id of the studentTask to save.
     * @param studentTask the studentTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentTask,
     * or with status {@code 400 (Bad Request)} if the studentTask is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/student-tasks/{id}")
    public ResponseEntity<StudentTask> updateStudentTask(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudentTask studentTask
    ) throws URISyntaxException {
        log.debug("REST request to update StudentTask : {}, {}", id, studentTask);
        if (studentTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentTask.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentTaskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        StudentTask result = studentTask;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentTask.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /student-tasks/:id} : Partial updates given fields of an existing studentTask, field will ignore if it is null
     *
     * @param id the id of the studentTask to save.
     * @param studentTask the studentTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentTask,
     * or with status {@code 400 (Bad Request)} if the studentTask is not valid,
     * or with status {@code 404 (Not Found)} if the studentTask is not found,
     * or with status {@code 500 (Internal Server Error)} if the studentTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/student-tasks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudentTask> partialUpdateStudentTask(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudentTask studentTask
    ) throws URISyntaxException {
        log.debug("REST request to partial update StudentTask partially : {}, {}", id, studentTask);
        if (studentTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentTask.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentTaskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudentTask> result = studentTaskRepository
            .findById(studentTask.getId())
            .map(existingStudentTask -> {
                return existingStudentTask;
            }); // .map(studentTaskRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentTask.getId().toString())
        );
    }

    /**
     * {@code GET  /student-tasks} : get all the studentTasks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentTasks in body.
     */
    @GetMapping("/student-tasks")
    public List<StudentTask> getAllStudentTasks() {
        log.debug("REST request to get all StudentTasks");
        return studentTaskRepository.findAll();
    }

    /**
     * {@code GET  /student-tasks/:id} : get the "id" studentTask.
     *
     * @param id the id of the studentTask to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentTask, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/student-tasks/{id}")
    public ResponseEntity<StudentTask> getStudentTask(@PathVariable Long id) {
        log.debug("REST request to get StudentTask : {}", id);
        Optional<StudentTask> studentTask = studentTaskRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(studentTask);
    }

    /**
     * {@code DELETE  /student-tasks/:id} : delete the "id" studentTask.
     *
     * @param id the id of the studentTask to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/student-tasks/{id}")
    public ResponseEntity<Void> deleteStudentTask(@PathVariable Long id) {
        log.debug("REST request to delete StudentTask : {}", id);
        studentTaskRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
