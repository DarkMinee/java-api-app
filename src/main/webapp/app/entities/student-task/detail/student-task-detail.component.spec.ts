import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentTaskDetailComponent } from './student-task-detail.component';

describe('StudentTask Management Detail Component', () => {
  let comp: StudentTaskDetailComponent;
  let fixture: ComponentFixture<StudentTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ studentTask: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StudentTaskDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudentTaskDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load studentTask on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.studentTask).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
