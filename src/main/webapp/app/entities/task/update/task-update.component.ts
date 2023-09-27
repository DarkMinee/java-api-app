import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TaskFormService, TaskFormGroup } from './task-form.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { IStudentTask } from 'app/entities/student-task/student-task.model';
import { StudentTaskService } from 'app/entities/student-task/service/student-task.service';
import { Subject } from 'app/entities/enumerations/subject.model';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;
  subjectValues = Object.keys(Subject);

  studentTasksSharedCollection: IStudentTask[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected studentTaskService: StudentTaskService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStudentTask = (o1: IStudentTask | null, o2: IStudentTask | null): boolean => this.studentTaskService.compareStudentTask(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.studentTasksSharedCollection = this.studentTaskService.addStudentTaskToCollectionIfMissing<IStudentTask>(
      this.studentTasksSharedCollection,
      ...(task.studentTasks ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentTaskService
      .query()
      .pipe(map((res: HttpResponse<IStudentTask[]>) => res.body ?? []))
      .pipe(
        map((studentTasks: IStudentTask[]) =>
          this.studentTaskService.addStudentTaskToCollectionIfMissing<IStudentTask>(studentTasks, ...(this.task?.studentTasks ?? []))
        )
      )
      .subscribe((studentTasks: IStudentTask[]) => (this.studentTasksSharedCollection = studentTasks));
  }
}
