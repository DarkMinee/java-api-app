import { IStudentTask } from 'app/entities/student-task/student-task.model';
import { Subject } from 'app/entities/enumerations/subject.model';

export interface ITask {
  id: number;
  date?: string | null;
  subject?: Subject | null;
  grade?: number | null;
  studentTasks?: Pick<IStudentTask, 'id'>[] | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
