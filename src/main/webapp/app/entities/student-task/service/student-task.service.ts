import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudentTask, NewStudentTask } from '../student-task.model';

export type PartialUpdateStudentTask = Partial<IStudentTask> & Pick<IStudentTask, 'id'>;

export type EntityResponseType = HttpResponse<IStudentTask>;
export type EntityArrayResponseType = HttpResponse<IStudentTask[]>;

@Injectable({ providedIn: 'root' })
export class StudentTaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/student-tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(studentTask: NewStudentTask): Observable<EntityResponseType> {
    return this.http.post<IStudentTask>(this.resourceUrl, studentTask, { observe: 'response' });
  }

  update(studentTask: IStudentTask): Observable<EntityResponseType> {
    return this.http.put<IStudentTask>(`${this.resourceUrl}/${this.getStudentTaskIdentifier(studentTask)}`, studentTask, {
      observe: 'response',
    });
  }

  partialUpdate(studentTask: PartialUpdateStudentTask): Observable<EntityResponseType> {
    return this.http.patch<IStudentTask>(`${this.resourceUrl}/${this.getStudentTaskIdentifier(studentTask)}`, studentTask, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStudentTask>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStudentTask[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStudentTaskIdentifier(studentTask: Pick<IStudentTask, 'id'>): number {
    return studentTask.id;
  }

  compareStudentTask(o1: Pick<IStudentTask, 'id'> | null, o2: Pick<IStudentTask, 'id'> | null): boolean {
    return o1 && o2 ? this.getStudentTaskIdentifier(o1) === this.getStudentTaskIdentifier(o2) : o1 === o2;
  }

  addStudentTaskToCollectionIfMissing<Type extends Pick<IStudentTask, 'id'>>(
    studentTaskCollection: Type[],
    ...studentTasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const studentTasks: Type[] = studentTasksToCheck.filter(isPresent);
    if (studentTasks.length > 0) {
      const studentTaskCollectionIdentifiers = studentTaskCollection.map(
        studentTaskItem => this.getStudentTaskIdentifier(studentTaskItem)!
      );
      const studentTasksToAdd = studentTasks.filter(studentTaskItem => {
        const studentTaskIdentifier = this.getStudentTaskIdentifier(studentTaskItem);
        if (studentTaskCollectionIdentifiers.includes(studentTaskIdentifier)) {
          return false;
        }
        studentTaskCollectionIdentifiers.push(studentTaskIdentifier);
        return true;
      });
      return [...studentTasksToAdd, ...studentTaskCollection];
    }
    return studentTaskCollection;
  }
}
