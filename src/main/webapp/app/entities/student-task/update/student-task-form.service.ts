import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStudentTask, NewStudentTask } from '../student-task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudentTask for edit and NewStudentTaskFormGroupInput for create.
 */
type StudentTaskFormGroupInput = IStudentTask | PartialWithRequiredKeyOf<NewStudentTask>;

type StudentTaskFormDefaults = Pick<NewStudentTask, 'id' | 'students' | 'tasks'>;

type StudentTaskFormGroupContent = {
  id: FormControl<IStudentTask['id'] | NewStudentTask['id']>;
  students: FormControl<IStudentTask['students']>;
  tasks: FormControl<IStudentTask['tasks']>;
};

export type StudentTaskFormGroup = FormGroup<StudentTaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentTaskFormService {
  createStudentTaskFormGroup(studentTask: StudentTaskFormGroupInput = { id: null }): StudentTaskFormGroup {
    const studentTaskRawValue = {
      ...this.getFormDefaults(),
      ...studentTask,
    };
    return new FormGroup<StudentTaskFormGroupContent>({
      id: new FormControl(
        { value: studentTaskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      students: new FormControl(studentTaskRawValue.students ?? []),
      tasks: new FormControl(studentTaskRawValue.tasks ?? []),
    });
  }

  getStudentTask(form: StudentTaskFormGroup): IStudentTask | NewStudentTask {
    return form.getRawValue() as IStudentTask | NewStudentTask;
  }

  resetForm(form: StudentTaskFormGroup, studentTask: StudentTaskFormGroupInput): void {
    const studentTaskRawValue = { ...this.getFormDefaults(), ...studentTask };
    form.reset(
      {
        ...studentTaskRawValue,
        id: { value: studentTaskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudentTaskFormDefaults {
    return {
      id: null,
      students: [],
      tasks: [],
    };
  }
}
