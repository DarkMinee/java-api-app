import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClassroomFormService } from './classroom-form.service';
import { ClassroomService } from '../service/classroom.service';
import { IClassroom } from '../classroom.model';

import { ClassroomUpdateComponent } from './classroom-update.component';

describe('Classroom Management Update Component', () => {
  let comp: ClassroomUpdateComponent;
  let fixture: ComponentFixture<ClassroomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classroomFormService: ClassroomFormService;
  let classroomService: ClassroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClassroomUpdateComponent],
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
      .overrideTemplate(ClassroomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClassroomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classroomFormService = TestBed.inject(ClassroomFormService);
    classroomService = TestBed.inject(ClassroomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const classroom: IClassroom = { id: 456 };

      activatedRoute.data = of({ classroom });
      comp.ngOnInit();

      expect(comp.classroom).toEqual(classroom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassroom>>();
      const classroom = { id: 123 };
      jest.spyOn(classroomFormService, 'getClassroom').mockReturnValue(classroom);
      jest.spyOn(classroomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classroom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classroom }));
      saveSubject.complete();

      // THEN
      expect(classroomFormService.getClassroom).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classroomService.update).toHaveBeenCalledWith(expect.objectContaining(classroom));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassroom>>();
      const classroom = { id: 123 };
      jest.spyOn(classroomFormService, 'getClassroom').mockReturnValue({ id: null });
      jest.spyOn(classroomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classroom: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classroom }));
      saveSubject.complete();

      // THEN
      expect(classroomFormService.getClassroom).toHaveBeenCalled();
      expect(classroomService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClassroom>>();
      const classroom = { id: 123 };
      jest.spyOn(classroomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classroom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classroomService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
