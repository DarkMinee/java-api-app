package org.jhipster.api.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.jhipster.api.domain.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class StudentRepositoryWithBagRelationshipsImpl implements StudentRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Student> fetchBagRelationships(Optional<Student> student) {
        return student.map(this::fetchStudentTasks);
    }

    @Override
    public Page<Student> fetchBagRelationships(Page<Student> students) {
        return new PageImpl<>(fetchBagRelationships(students.getContent()), students.getPageable(), students.getTotalElements());
    }

    @Override
    public List<Student> fetchBagRelationships(List<Student> students) {
        return Optional.of(students).map(this::fetchStudentTasks).orElse(Collections.emptyList());
    }

    Student fetchStudentTasks(Student result) {
        return entityManager
            .createQuery(
                "select student from Student student left join fetch student.studentTasks where student is :student",
                Student.class
            )
            .setParameter("student", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Student> fetchStudentTasks(List<Student> students) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, students.size()).forEach(index -> order.put(students.get(index).getId(), index));
        List<Student> result = entityManager
            .createQuery(
                "select distinct student from Student student left join fetch student.studentTasks where student in :students",
                Student.class
            )
            .setParameter("students", students)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
