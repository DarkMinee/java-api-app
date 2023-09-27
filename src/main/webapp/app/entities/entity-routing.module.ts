import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'classroom',
        data: { pageTitle: 'javaApiApp.classroom.home.title' },
        loadChildren: () => import('./classroom/classroom.module').then(m => m.ClassroomModule),
      },
      {
        path: 'student',
        data: { pageTitle: 'javaApiApp.student.home.title' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'javaApiApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'student-task',
        data: { pageTitle: 'javaApiApp.studentTask.home.title' },
        loadChildren: () => import('./student-task/student-task.module').then(m => m.StudentTaskModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
