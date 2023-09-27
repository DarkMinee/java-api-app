package org.jhipster.api.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.jhipster.api.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StudentTaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentTask.class);
        StudentTask studentTask1 = new StudentTask();
        studentTask1.setId(1L);
        StudentTask studentTask2 = new StudentTask();
        studentTask2.setId(studentTask1.getId());
        assertThat(studentTask1).isEqualTo(studentTask2);
        studentTask2.setId(2L);
        assertThat(studentTask1).isNotEqualTo(studentTask2);
        studentTask1.setId(null);
        assertThat(studentTask1).isNotEqualTo(studentTask2);
    }
}
