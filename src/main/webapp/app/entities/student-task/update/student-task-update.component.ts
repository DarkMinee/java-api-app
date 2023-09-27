import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StudentTaskFormService, StudentTaskFormGroup } from './student-task-form.service';
import { IStudentTask } from '../student-task.model';
import { StudentTaskService } from '../service/student-task.service';

@Component({
  selector: 'jhi-student-task-update',
  templateUrl: './student-task-update.component.html',
})
export class StudentTaskUpdateComponent implements OnInit {
  isSaving = false;
  studentTask: IStudentTask | null = null;

  editForm: StudentTaskFormGroup = this.studentTaskFormService.createStudentTaskFormGroup();

  constructor(
    protected studentTaskService: StudentTaskService,
    protected studentTaskFormService: StudentTaskFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentTask }) => {
      this.studentTask = studentTask;
      if (studentTask) {
        this.updateForm(studentTask);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const studentTask = this.studentTaskFormService.getStudentTask(this.editForm);
    if (studentTask.id !== null) {
      this.subscribeToSaveResponse(this.studentTaskService.update(studentTask));
    } else {
      this.subscribeToSaveResponse(this.studentTaskService.create(studentTask));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudentTask>>): void {
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

  protected updateForm(studentTask: IStudentTask): void {
    this.studentTask = studentTask;
    this.studentTaskFormService.resetForm(this.editForm, studentTask);
  }
}
