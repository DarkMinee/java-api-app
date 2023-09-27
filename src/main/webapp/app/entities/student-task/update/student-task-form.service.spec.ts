import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../student-task.test-samples';

import { StudentTaskFormService } from './student-task-form.service';

describe('StudentTask Form Service', () => {
  let service: StudentTaskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentTaskFormService);
  });

  describe('Service methods', () => {
    describe('createStudentTaskFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStudentTaskFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            students: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });

      it('passing IStudentTask should create a new form with FormGroup', () => {
        const formGroup = service.createStudentTaskFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            students: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });
    });

    describe('getStudentTask', () => {
      it('should return NewStudentTask for default StudentTask initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStudentTaskFormGroup(sampleWithNewData);

        const studentTask = service.getStudentTask(formGroup) as any;

        expect(studentTask).toMatchObject(sampleWithNewData);
      });

      it('should return NewStudentTask for empty StudentTask initial value', () => {
        const formGroup = service.createStudentTaskFormGroup();

        const studentTask = service.getStudentTask(formGroup) as any;

        expect(studentTask).toMatchObject({});
      });

      it('should return IStudentTask', () => {
        const formGroup = service.createStudentTaskFormGroup(sampleWithRequiredData);

        const studentTask = service.getStudentTask(formGroup) as any;

        expect(studentTask).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStudentTask should not enable id FormControl', () => {
        const formGroup = service.createStudentTaskFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStudentTask should disable id FormControl', () => {
        const formGroup = service.createStudentTaskFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
