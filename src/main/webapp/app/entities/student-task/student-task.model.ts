import { IStudent } from 'app/entities/student/student.model';
import { ITask } from 'app/entities/task/task.model';

export interface IStudentTask {
  id: number;
  students?: Pick<IStudent, 'id'>[] | null;
  tasks?: Pick<ITask, 'id'>[] | null;
}

export type NewStudentTask = Omit<IStudentTask, 'id'> & { id: null };
