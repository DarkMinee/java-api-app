import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudentTask } from '../student-task.model';

@Component({
  selector: 'jhi-student-task-detail',
  templateUrl: './student-task-detail.component.html',
})
export class StudentTaskDetailComponent implements OnInit {
  studentTask: IStudentTask | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentTask }) => {
      this.studentTask = studentTask;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
