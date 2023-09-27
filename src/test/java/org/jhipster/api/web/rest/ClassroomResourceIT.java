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
import org.jhipster.api.domain.Classroom;
import org.jhipster.api.repository.ClassroomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ClassroomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClassroomResourceIT {

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final String DEFAULT_SECTION = "AAAAAAAAAA";
    private static final String UPDATED_SECTION = "BBBBBBBBBB";

    private static final String DEFAULT_DESC = "AAAAAAAAAA";
    private static final String UPDATED_DESC = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/classrooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClassroomMockMvc;

    private Classroom classroom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classroom createEntity(EntityManager em) {
        Classroom classroom = new Classroom().number(DEFAULT_NUMBER).section(DEFAULT_SECTION).desc(DEFAULT_DESC);
        return classroom;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classroom createUpdatedEntity(EntityManager em) {
        Classroom classroom = new Classroom().number(UPDATED_NUMBER).section(UPDATED_SECTION).desc(UPDATED_DESC);
        return classroom;
    }

    @BeforeEach
    public void initTest() {
        classroom = createEntity(em);
    }

    @Test
    @Transactional
    void createClassroom() throws Exception {
        int databaseSizeBeforeCreate = classroomRepository.findAll().size();
        // Create the Classroom
        restClassroomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classroom)))
            .andExpect(status().isCreated());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeCreate + 1);
        Classroom testClassroom = classroomList.get(classroomList.size() - 1);
        assertThat(testClassroom.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testClassroom.getSection()).isEqualTo(DEFAULT_SECTION);
        assertThat(testClassroom.getDesc()).isEqualTo(DEFAULT_DESC);
    }

    @Test
    @Transactional
    void createClassroomWithExistingId() throws Exception {
        // Create the Classroom with an existing ID
        classroom.setId(1L);

        int databaseSizeBeforeCreate = classroomRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClassroomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classroom)))
            .andExpect(status().isBadRequest());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClassrooms() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        // Get all the classroomList
        restClassroomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classroom.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].section").value(hasItem(DEFAULT_SECTION)))
            .andExpect(jsonPath("$.[*].desc").value(hasItem(DEFAULT_DESC)));
    }

    @Test
    @Transactional
    void getClassroom() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        // Get the classroom
        restClassroomMockMvc
            .perform(get(ENTITY_API_URL_ID, classroom.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classroom.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.section").value(DEFAULT_SECTION))
            .andExpect(jsonPath("$.desc").value(DEFAULT_DESC));
    }

    @Test
    @Transactional
    void getNonExistingClassroom() throws Exception {
        // Get the classroom
        restClassroomMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClassroom() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();

        // Update the classroom
        Classroom updatedClassroom = classroomRepository.findById(classroom.getId()).get();
        // Disconnect from session so that the updates on updatedClassroom are not directly saved in db
        em.detach(updatedClassroom);
        updatedClassroom.number(UPDATED_NUMBER).section(UPDATED_SECTION).desc(UPDATED_DESC);

        restClassroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClassroom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClassroom))
            )
            .andExpect(status().isOk());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
        Classroom testClassroom = classroomList.get(classroomList.size() - 1);
        assertThat(testClassroom.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testClassroom.getSection()).isEqualTo(UPDATED_SECTION);
        assertThat(testClassroom.getDesc()).isEqualTo(UPDATED_DESC);
    }

    @Test
    @Transactional
    void putNonExistingClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classroom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classroom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClassroomWithPatch() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();

        // Update the classroom using partial update
        Classroom partialUpdatedClassroom = new Classroom();
        partialUpdatedClassroom.setId(classroom.getId());

        partialUpdatedClassroom.number(UPDATED_NUMBER).section(UPDATED_SECTION).desc(UPDATED_DESC);

        restClassroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassroom))
            )
            .andExpect(status().isOk());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
        Classroom testClassroom = classroomList.get(classroomList.size() - 1);
        assertThat(testClassroom.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testClassroom.getSection()).isEqualTo(UPDATED_SECTION);
        assertThat(testClassroom.getDesc()).isEqualTo(UPDATED_DESC);
    }

    @Test
    @Transactional
    void fullUpdateClassroomWithPatch() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();

        // Update the classroom using partial update
        Classroom partialUpdatedClassroom = new Classroom();
        partialUpdatedClassroom.setId(classroom.getId());

        partialUpdatedClassroom.number(UPDATED_NUMBER).section(UPDATED_SECTION).desc(UPDATED_DESC);

        restClassroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassroom))
            )
            .andExpect(status().isOk());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
        Classroom testClassroom = classroomList.get(classroomList.size() - 1);
        assertThat(testClassroom.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testClassroom.getSection()).isEqualTo(UPDATED_SECTION);
        assertThat(testClassroom.getDesc()).isEqualTo(UPDATED_DESC);
    }

    @Test
    @Transactional
    void patchNonExistingClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClassroom() throws Exception {
        int databaseSizeBeforeUpdate = classroomRepository.findAll().size();
        classroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassroomMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(classroom))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classroom in the database
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClassroom() throws Exception {
        // Initialize the database
        classroomRepository.saveAndFlush(classroom);

        int databaseSizeBeforeDelete = classroomRepository.findAll().size();

        // Delete the classroom
        restClassroomMockMvc
            .perform(delete(ENTITY_API_URL_ID, classroom.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Classroom> classroomList = classroomRepository.findAll();
        assertThat(classroomList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
