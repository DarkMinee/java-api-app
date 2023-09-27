package org.jhipster.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.jhipster.api.domain.enumeration.Subject;

/**
 * A Task.
 */
@Entity
@Table(name = "task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private String date;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject")
    private Subject subject;

    @Min(value = 1)
    @Max(value = 10)
    @Column(name = "grade")
    private Integer grade;

    @ManyToMany
    @JoinTable(
        name = "rel_task__student_task",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "student_task_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "students", "tasks" }, allowSetters = true)
    private Set<StudentTask> studentTasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Task id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return this.date;
    }

    public Task date(String date) {
        this.setDate(date);
        return this;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Subject getSubject() {
        return this.subject;
    }

    public Task subject(Subject subject) {
        this.setSubject(subject);
        return this;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Integer getGrade() {
        return this.grade;
    }

    public Task grade(Integer grade) {
        this.setGrade(grade);
        return this;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public Set<StudentTask> getStudentTasks() {
        return this.studentTasks;
    }

    public void setStudentTasks(Set<StudentTask> studentTasks) {
        this.studentTasks = studentTasks;
    }

    public Task studentTasks(Set<StudentTask> studentTasks) {
        this.setStudentTasks(studentTasks);
        return this;
    }

    public Task addStudentTask(StudentTask studentTask) {
        this.studentTasks.add(studentTask);
        studentTask.getTasks().add(this);
        return this;
    }

    public Task removeStudentTask(StudentTask studentTask) {
        this.studentTasks.remove(studentTask);
        studentTask.getTasks().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Task)) {
            return false;
        }
        return id != null && id.equals(((Task) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Task{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", subject='" + getSubject() + "'" +
            ", grade=" + getGrade() +
            "}";
    }
}
