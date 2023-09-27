import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentTaskService } from '../service/student-task.service';

import { StudentTaskComponent } from './student-task.component';

describe('StudentTask Management Component', () => {
  let comp: StudentTaskComponent;
  let fixture: ComponentFixture<StudentTaskComponent>;
  let service: StudentTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'student-task', component: StudentTaskComponent }]), HttpClientTestingModule],
      declarations: [StudentTaskComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StudentTaskComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentTaskComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StudentTaskService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.studentTasks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to studentTaskService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStudentTaskIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStudentTaskIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
