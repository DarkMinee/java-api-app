import { IStudentTask, NewStudentTask } from './student-task.model';

export const sampleWithRequiredData: IStudentTask = {
  id: 81632,
};

export const sampleWithPartialData: IStudentTask = {
  id: 65049,
};

export const sampleWithFullData: IStudentTask = {
  id: 91957,
};

export const sampleWithNewData: NewStudentTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
