import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentTaskFormService } from './student-task-form.service';
import { StudentTaskService } from '../service/student-task.service';
import { IStudentTask } from '../student-task.model';

import { StudentTaskUpdateComponent } from './student-task-update.component';

describe('StudentTask Management Update Component', () => {
  let comp: StudentTaskUpdateComponent;
  let fixture: ComponentFixture<StudentTaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentTaskFormService: StudentTaskFormService;
  let studentTaskService: StudentTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentTaskUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StudentTaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentTaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentTaskFormService = TestBed.inject(StudentTaskFormService);
    studentTaskService = TestBed.inject(StudentTaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const studentTask: IStudentTask = { id: 456 };

      activatedRoute.data = of({ studentTask });
      comp.ngOnInit();

      expect(comp.studentTask).toEqual(studentTask);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentTask>>();
      const studentTask = { id: 123 };
      jest.spyOn(studentTaskFormService, 'getStudentTask').mockReturnValue(studentTask);
      jest.spyOn(studentTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentTask }));
      saveSubject.complete();

      // THEN
      expect(studentTaskFormService.getStudentTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentTaskService.update).toHaveBeenCalledWith(expect.objectContaining(studentTask));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentTask>>();
      const studentTask = { id: 123 };
      jest.spyOn(studentTaskFormService, 'getStudentTask').mockReturnValue({ id: null });
      jest.spyOn(studentTaskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentTask: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentTask }));
      saveSubject.complete();

      // THEN
      expect(studentTaskFormService.getStudentTask).toHaveBeenCalled();
      expect(studentTaskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentTask>>();
      const studentTask = { id: 123 };
      jest.spyOn(studentTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentTaskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
