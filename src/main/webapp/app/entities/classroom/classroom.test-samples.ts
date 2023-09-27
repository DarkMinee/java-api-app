import { IClassroom, NewClassroom } from './classroom.model';

export const sampleWithRequiredData: IClassroom = {
  id: 84316,
};

export const sampleWithPartialData: IClassroom = {
  id: 78270,
};

export const sampleWithFullData: IClassroom = {
  id: 82666,
  number: 59981,
  section: 'Dollar Investor Steel',
  desc: 'Specialist application Strada',
};

export const sampleWithNewData: NewClassroom = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
