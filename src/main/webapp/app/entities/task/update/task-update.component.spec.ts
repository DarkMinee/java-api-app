import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TaskFormService } from './task-form.service';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { IStudentTask } from 'app/entities/student-task/student-task.model';
import { StudentTaskService } from 'app/entities/student-task/service/student-task.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Task Management Update Component', () => {
  let comp: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskFormService;
  let taskService: TaskService;
  let studentTaskService: StudentTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TaskUpdateComponent],
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
      .overrideTemplate(TaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskFormService);
    taskService = TestBed.inject(TaskService);
    studentTaskService = TestBed.inject(StudentTaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call StudentTask query and add missing value', () => {
      const task: ITask = { id: 456 };
      const studentTasks: IStudentTask[] = [{ id: 58591 }];
      task.studentTasks = studentTasks;

      const studentTaskCollection: IStudentTask[] = [{ id: 99093 }];
      jest.spyOn(studentTaskService, 'query').mockReturnValue(of(new HttpResponse({ body: studentTaskCollection })));
      const additionalStudentTasks = [...studentTasks];
      const expectedCollection: IStudentTask[] = [...additionalStudentTasks, ...studentTaskCollection];
      jest.spyOn(studentTaskService, 'addStudentTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(studentTaskService.query).toHaveBeenCalled();
      expect(studentTaskService.addStudentTaskToCollectionIfMissing).toHaveBeenCalledWith(
        studentTaskCollection,
        ...additionalStudentTasks.map(expect.objectContaining)
      );
      expect(comp.studentTasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const task: ITask = { id: 456 };
      const studentTask: IStudentTask = { id: 22979 };
      task.studentTasks = [studentTask];

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.studentTasksSharedCollection).toContain(studentTask);
      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue(task);
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
