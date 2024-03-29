package org.jhipster.api.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.jhipster.api.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TaskRepositoryWithBagRelationshipsImpl implements TaskRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Task> fetchBagRelationships(Optional<Task> task) {
        return task.map(this::fetchStudentTasks);
    }

    @Override
    public Page<Task> fetchBagRelationships(Page<Task> tasks) {
        return new PageImpl<>(fetchBagRelationships(tasks.getContent()), tasks.getPageable(), tasks.getTotalElements());
    }

    @Override
    public List<Task> fetchBagRelationships(List<Task> tasks) {
        return Optional.of(tasks).map(this::fetchStudentTasks).orElse(Collections.emptyList());
    }

    Task fetchStudentTasks(Task result) {
        return entityManager
            .createQuery("select task from Task task left join fetch task.studentTasks where task is :task", Task.class)
            .setParameter("task", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Task> fetchStudentTasks(List<Task> tasks) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tasks.size()).forEach(index -> order.put(tasks.get(index).getId(), index));
        List<Task> result = entityManager
            .createQuery("select distinct task from Task task left join fetch task.studentTasks where task in :tasks", Task.class)
            .setParameter("tasks", tasks)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
