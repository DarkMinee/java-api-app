import { Subject } from 'app/entities/enumerations/subject.model';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
};

export const sampleWithPartialData: ITask = {
  id: 38844,
  date: 'Strategist National',
  subject: Subject['ITALIANO'],
};

export const sampleWithFullData: ITask = {
  id: 84034,
  date: 'Kwacha Granite TCP',
  subject: Subject['STORIA'],
  grade: 5,
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
