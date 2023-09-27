import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 23105,
};

export const sampleWithPartialData: IStudent = {
  id: 80092,
  name: 'Via incentivate Refined',
  surname: 'backing Handmade',
};

export const sampleWithFullData: IStudent = {
  id: 68555,
  name: 'hard Home',
  surname: 'dinamiche e Sassari',
  date: 'deposit',
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
