import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudentTask } from '../student-task.model';
import { StudentTaskService } from '../service/student-task.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './student-task-delete-dialog.component.html',
})
export class StudentTaskDeleteDialogComponent {
  studentTask?: IStudentTask;

  constructor(protected studentTaskService: StudentTaskService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentTaskService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
