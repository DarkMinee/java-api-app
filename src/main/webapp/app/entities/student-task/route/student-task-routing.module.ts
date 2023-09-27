import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudentTaskComponent } from '../list/student-task.component';
import { StudentTaskDetailComponent } from '../detail/student-task-detail.component';
import { StudentTaskUpdateComponent } from '../update/student-task-update.component';
import { StudentTaskRoutingResolveService } from './student-task-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const studentTaskRoute: Routes = [
  {
    path: '',
    component: StudentTaskComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentTaskDetailComponent,
    resolve: {
      studentTask: StudentTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentTaskUpdateComponent,
    resolve: {
      studentTask: StudentTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentTaskUpdateComponent,
    resolve: {
      studentTask: StudentTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(studentTaskRoute)],
  exports: [RouterModule],
})
export class StudentTaskRoutingModule {}
