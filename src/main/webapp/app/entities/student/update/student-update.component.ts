import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StudentFormService, StudentFormGroup } from './student-form.service';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';
import { IClassroom } from 'app/entities/classroom/classroom.model';
import { ClassroomService } from 'app/entities/classroom/service/classroom.service';
import { IStudentTask } from 'app/entities/student-task/student-task.model';
import { StudentTaskService } from 'app/entities/student-task/service/student-task.service';

@Component({
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;
  student: IStudent | null = null;

  classroomsSharedCollection: IClassroom[] = [];
  studentTasksSharedCollection: IStudentTask[] = [];

  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  constructor(
    protected studentService: StudentService,
    protected studentFormService: StudentFormService,
    protected classroomService: ClassroomService,
    protected studentTaskService: StudentTaskService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClassroom = (o1: IClassroom | null, o2: IClassroom | null): boolean => this.classroomService.compareClassroom(o1, o2);

  compareStudentTask = (o1: IStudentTask | null, o2: IStudentTask | null): boolean => this.studentTaskService.compareStudentTask(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.studentFormService.getStudent(this.editForm);
    if (student.id !== null) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);

    this.classroomsSharedCollection = this.classroomService.addClassroomToCollectionIfMissing<IClassroom>(
      this.classroomsSharedCollection,
      student.classroom
    );
    this.studentTasksSharedCollection = this.studentTaskService.addStudentTaskToCollectionIfMissing<IStudentTask>(
      this.studentTasksSharedCollection,
      ...(student.studentTasks ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.classroomService
      .query()
      .pipe(map((res: HttpResponse<IClassroom[]>) => res.body ?? []))
      .pipe(
        map((classrooms: IClassroom[]) =>
          this.classroomService.addClassroomToCollectionIfMissing<IClassroom>(classrooms, this.student?.classroom)
        )
      )
      .subscribe((classrooms: IClassroom[]) => (this.classroomsSharedCollection = classrooms));

    this.studentTaskService
      .query()
      .pipe(map((res: HttpResponse<IStudentTask[]>) => res.body ?? []))
      .pipe(
        map((studentTasks: IStudentTask[]) =>
          this.studentTaskService.addStudentTaskToCollectionIfMissing<IStudentTask>(studentTasks, ...(this.student?.studentTasks ?? []))
        )
      )
      .subscribe((studentTasks: IStudentTask[]) => (this.studentTasksSharedCollection = studentTasks));
  }
}
