package org.jhipster.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Classroom.
 */
@Entity
@Table(name = "classroom")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Classroom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "number")
    private Integer number;

    @Column(name = "section")
    private String section;

    @Column(name = "jhi_desc")
    private String desc;

    @OneToMany(mappedBy = "classroom")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classroom", "studentTasks" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Classroom id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return this.number;
    }

    public Classroom number(Integer number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getSection() {
        return this.section;
    }

    public Classroom section(String section) {
        this.setSection(section);
        return this;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getDesc() {
        return this.desc;
    }

    public Classroom desc(String desc) {
        this.setDesc(desc);
        return this;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.setClassroom(null));
        }
        if (students != null) {
            students.forEach(i -> i.setClassroom(this));
        }
        this.students = students;
    }

    public Classroom students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public Classroom addStudent(Student student) {
        this.students.add(student);
        student.setClassroom(this);
        return this;
    }

    public Classroom removeStudent(Student student) {
        this.students.remove(student);
        student.setClassroom(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Classroom)) {
            return false;
        }
        return id != null && id.equals(((Classroom) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Classroom{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            ", section='" + getSection() + "'" +
            ", desc='" + getDesc() + "'" +
            "}";
    }
}
