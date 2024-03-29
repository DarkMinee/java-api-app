import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClassroomService } from '../service/classroom.service';

import { ClassroomComponent } from './classroom.component';

describe('Classroom Management Component', () => {
  let comp: ClassroomComponent;
  let fixture: ComponentFixture<ClassroomComponent>;
  let service: ClassroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'classroom', component: ClassroomComponent }]), HttpClientTestingModule],
      declarations: [ClassroomComponent],
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
      .overrideTemplate(ClassroomComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClassroomComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClassroomService);

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
    expect(comp.classrooms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to classroomService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClassroomIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClassroomIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
