import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentFormService } from './student-form.service';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';
import { IClassroom } from 'app/entities/classroom/classroom.model';
import { ClassroomService } from 'app/entities/classroom/service/classroom.service';
import { IStudentTask } from 'app/entities/student-task/student-task.model';
import { StudentTaskService } from 'app/entities/student-task/service/student-task.service';

import { StudentUpdateComponent } from './student-update.component';

describe('Student Management Update Component', () => {
  let comp: StudentUpdateComponent;
  let fixture: ComponentFixture<StudentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentFormService: StudentFormService;
  let studentService: StudentService;
  let classroomService: ClassroomService;
  let studentTaskService: StudentTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentUpdateComponent],
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
      .overrideTemplate(StudentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentFormService = TestBed.inject(StudentFormService);
    studentService = TestBed.inject(StudentService);
    classroomService = TestBed.inject(ClassroomService);
    studentTaskService = TestBed.inject(StudentTaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Classroom query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const classroom: IClassroom = { id: 32437 };
      student.classroom = classroom;

      const classroomCollection: IClassroom[] = [{ id: 76854 }];
      jest.spyOn(classroomService, 'query').mockReturnValue(of(new HttpResponse({ body: classroomCollection })));
      const additionalClassrooms = [classroom];
      const expectedCollection: IClassroom[] = [...additionalClassrooms, ...classroomCollection];
      jest.spyOn(classroomService, 'addClassroomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(classroomService.query).toHaveBeenCalled();
      expect(classroomService.addClassroomToCollectionIfMissing).toHaveBeenCalledWith(
        classroomCollection,
        ...additionalClassrooms.map(expect.objectContaining)
      );
      expect(comp.classroomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call StudentTask query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const studentTasks: IStudentTask[] = [{ id: 82539 }];
      student.studentTasks = studentTasks;

      const studentTaskCollection: IStudentTask[] = [{ id: 50532 }];
      jest.spyOn(studentTaskService, 'query').mockReturnValue(of(new HttpResponse({ body: studentTaskCollection })));
      const additionalStudentTasks = [...studentTasks];
      const expectedCollection: IStudentTask[] = [...additionalStudentTasks, ...studentTaskCollection];
      jest.spyOn(studentTaskService, 'addStudentTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(studentTaskService.query).toHaveBeenCalled();
      expect(studentTaskService.addStudentTaskToCollectionIfMissing).toHaveBeenCalledWith(
        studentTaskCollection,
        ...additionalStudentTasks.map(expect.objectContaining)
      );
      expect(comp.studentTasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const student: IStudent = { id: 456 };
      const classroom: IClassroom = { id: 29729 };
      student.classroom = classroom;
      const studentTask: IStudentTask = { id: 42689 };
      student.studentTasks = [studentTask];

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(comp.classroomsSharedCollection).toContain(classroom);
      expect(comp.studentTasksSharedCollection).toContain(studentTask);
      expect(comp.student).toEqual(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue(student);
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentService.update).toHaveBeenCalledWith(expect.objectContaining(student));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue({ id: null });
      jest.spyOn(studentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(studentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClassroom', () => {
      it('Should forward to classroomService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(classroomService, 'compareClassroom');
        comp.compareClassroom(entity, entity2);
        expect(classroomService.compareClassroom).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStudentTask', () => {
      it('Should forward to studentTaskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentTaskService, 'compareStudentTask');
        comp.compareStudentTask(entity, entity2);
        expect(studentTaskService.compareStudentTask).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
