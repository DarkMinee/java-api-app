package org.jhipster.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentTask.
 */
@Entity
@Table(name = "student_task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToMany(mappedBy = "studentTasks")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classroom", "studentTasks" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    @ManyToMany(mappedBy = "studentTasks")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "studentTasks" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentTask id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.removeStudentTask(this));
        }
        if (students != null) {
            students.forEach(i -> i.addStudentTask(this));
        }
        this.students = students;
    }

    public StudentTask students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public StudentTask addStudent(Student student) {
        this.students.add(student);
        student.getStudentTasks().add(this);
        return this;
    }

    public StudentTask removeStudent(Student student) {
        this.students.remove(student);
        student.getStudentTasks().remove(this);
        return this;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.removeStudentTask(this));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.addStudentTask(this));
        }
        this.tasks = tasks;
    }

    public StudentTask tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public StudentTask addTask(Task task) {
        this.tasks.add(task);
        task.getStudentTasks().add(this);
        return this;
    }

    public StudentTask removeTask(Task task) {
        this.tasks.remove(task);
        task.getStudentTasks().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentTask)) {
            return false;
        }
        return id != null && id.equals(((StudentTask) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentTask{" +
            "id=" + getId() +
            "}";
    }
}
