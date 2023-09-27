import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StudentTaskComponent } from './list/student-task.component';
import { StudentTaskDetailComponent } from './detail/student-task-detail.component';
import { StudentTaskUpdateComponent } from './update/student-task-update.component';
import { StudentTaskDeleteDialogComponent } from './delete/student-task-delete-dialog.component';
import { StudentTaskRoutingModule } from './route/student-task-routing.module';

@NgModule({
  imports: [SharedModule, StudentTaskRoutingModule],
  declarations: [StudentTaskComponent, StudentTaskDetailComponent, StudentTaskUpdateComponent, StudentTaskDeleteDialogComponent],
})
export class StudentTaskModule {}
