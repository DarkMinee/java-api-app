import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ClassroomFormService, ClassroomFormGroup } from './classroom-form.service';
import { IClassroom } from '../classroom.model';
import { ClassroomService } from '../service/classroom.service';

@Component({
  selector: 'jhi-classroom-update',
  templateUrl: './classroom-update.component.html',
})
export class ClassroomUpdateComponent implements OnInit {
  isSaving = false;
  classroom: IClassroom | null = null;

  editForm: ClassroomFormGroup = this.classroomFormService.createClassroomFormGroup();

  constructor(
    protected classroomService: ClassroomService,
    protected classroomFormService: ClassroomFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classroom }) => {
      this.classroom = classroom;
      if (classroom) {
        this.updateForm(classroom);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classroom = this.classroomFormService.getClassroom(this.editForm);
    if (classroom.id !== null) {
      this.subscribeToSaveResponse(this.classroomService.update(classroom));
    } else {
      this.subscribeToSaveResponse(this.classroomService.create(classroom));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClassroom>>): void {
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

  protected updateForm(classroom: IClassroom): void {
    this.classroom = classroom;
    this.classroomFormService.resetForm(this.editForm, classroom);
  }
}
