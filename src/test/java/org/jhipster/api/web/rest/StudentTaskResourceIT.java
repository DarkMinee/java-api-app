package org.jhipster.api.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.jhipster.api.IntegrationTest;
import org.jhipster.api.domain.StudentTask;
import org.jhipster.api.repository.StudentTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StudentTaskResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StudentTaskResourceIT {

    private static final String ENTITY_API_URL = "/api/student-tasks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StudentTaskRepository studentTaskRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentTaskMockMvc;

    private StudentTask studentTask;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentTask createEntity(EntityManager em) {
        StudentTask studentTask = new StudentTask();
        return studentTask;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentTask createUpdatedEntity(EntityManager em) {
        StudentTask studentTask = new StudentTask();
        return studentTask;
    }

    @BeforeEach
    public void initTest() {
        studentTask = createEntity(em);
    }

    @Test
    @Transactional
    void createStudentTask() throws Exception {
        int databaseSizeBeforeCreate = studentTaskRepository.findAll().size();
        // Create the StudentTask
        restStudentTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentTask)))
            .andExpect(status().isCreated());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeCreate + 1);
        StudentTask testStudentTask = studentTaskList.get(studentTaskList.size() - 1);
    }

    @Test
    @Transactional
    void createStudentTaskWithExistingId() throws Exception {
        // Create the StudentTask with an existing ID
        studentTask.setId(1L);

        int databaseSizeBeforeCreate = studentTaskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentTask)))
            .andExpect(status().isBadRequest());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStudentTasks() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        // Get all the studentTaskList
        restStudentTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studentTask.getId().intValue())));
    }

    @Test
    @Transactional
    void getStudentTask() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        // Get the studentTask
        restStudentTaskMockMvc
            .perform(get(ENTITY_API_URL_ID, studentTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(studentTask.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingStudentTask() throws Exception {
        // Get the studentTask
        restStudentTaskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudentTask() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();

        // Update the studentTask
        StudentTask updatedStudentTask = studentTaskRepository.findById(studentTask.getId()).get();
        // Disconnect from session so that the updates on updatedStudentTask are not directly saved in db
        em.detach(updatedStudentTask);

        restStudentTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStudentTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStudentTask))
            )
            .andExpect(status().isOk());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
        StudentTask testStudentTask = studentTaskList.get(studentTaskList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentTask)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudentTaskWithPatch() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();

        // Update the studentTask using partial update
        StudentTask partialUpdatedStudentTask = new StudentTask();
        partialUpdatedStudentTask.setId(studentTask.getId());

        restStudentTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudentTask))
            )
            .andExpect(status().isOk());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
        StudentTask testStudentTask = studentTaskList.get(studentTaskList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateStudentTaskWithPatch() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();

        // Update the studentTask using partial update
        StudentTask partialUpdatedStudentTask = new StudentTask();
        partialUpdatedStudentTask.setId(studentTask.getId());

        restStudentTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudentTask))
            )
            .andExpect(status().isOk());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
        StudentTask testStudentTask = studentTaskList.get(studentTaskList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studentTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudentTask() throws Exception {
        int databaseSizeBeforeUpdate = studentTaskRepository.findAll().size();
        studentTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentTaskMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(studentTask))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentTask in the database
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudentTask() throws Exception {
        // Initialize the database
        studentTaskRepository.saveAndFlush(studentTask);

        int databaseSizeBeforeDelete = studentTaskRepository.findAll().size();

        // Delete the studentTask
        restStudentTaskMockMvc
            .perform(delete(ENTITY_API_URL_ID, studentTask.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StudentTask> studentTaskList = studentTaskRepository.findAll();
        assertThat(studentTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
