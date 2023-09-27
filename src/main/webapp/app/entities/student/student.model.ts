import { IClassroom } from 'app/entities/classroom/classroom.model';
import { IStudentTask } from 'app/entities/student-task/student-task.model';

export interface IStudent {
  id: number;
  name?: string | null;
  surname?: string | null;
  date?: string | null;
  classroom?: Pick<IClassroom, 'id'> | null;
  studentTasks?: Pick<IStudentTask, 'id'>[] | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
