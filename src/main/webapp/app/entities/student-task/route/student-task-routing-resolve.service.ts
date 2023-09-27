import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudentTask } from '../student-task.model';
import { StudentTaskService } from '../service/student-task.service';

@Injectable({ providedIn: 'root' })
export class StudentTaskRoutingResolveService implements Resolve<IStudentTask | null> {
  constructor(protected service: StudentTaskService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStudentTask | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((studentTask: HttpResponse<IStudentTask>) => {
          if (studentTask.body) {
            return of(studentTask.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
