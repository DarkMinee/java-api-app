import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClassroom, NewClassroom } from '../classroom.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClassroom for edit and NewClassroomFormGroupInput for create.
 */
type ClassroomFormGroupInput = IClassroom | PartialWithRequiredKeyOf<NewClassroom>;

type ClassroomFormDefaults = Pick<NewClassroom, 'id'>;

type ClassroomFormGroupContent = {
  id: FormControl<IClassroom['id'] | NewClassroom['id']>;
  number: FormControl<IClassroom['number']>;
  section: FormControl<IClassroom['section']>;
  desc: FormControl<IClassroom['desc']>;
};

export type ClassroomFormGroup = FormGroup<ClassroomFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClassroomFormService {
  createClassroomFormGroup(classroom: ClassroomFormGroupInput = { id: null }): ClassroomFormGroup {
    const classroomRawValue = {
      ...this.getFormDefaults(),
      ...classroom,
    };
    return new FormGroup<ClassroomFormGroupContent>({
      id: new FormControl(
        { value: classroomRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      number: new FormControl(classroomRawValue.number),
      section: new FormControl(classroomRawValue.section),
      desc: new FormControl(classroomRawValue.desc),
    });
  }

  getClassroom(form: ClassroomFormGroup): IClassroom | NewClassroom {
    return form.getRawValue() as IClassroom | NewClassroom;
  }

  resetForm(form: ClassroomFormGroup, classroom: ClassroomFormGroupInput): void {
    const classroomRawValue = { ...this.getFormDefaults(), ...classroom };
    form.reset(
      {
        ...classroomRawValue,
        id: { value: classroomRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClassroomFormDefaults {
    return {
      id: null,
    };
  }
}
