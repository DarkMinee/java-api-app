import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStudentTask } from '../student-task.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../student-task.test-samples';

import { StudentTaskService } from './student-task.service';

const requireRestSample: IStudentTask = {
  ...sampleWithRequiredData,
};

describe('StudentTask Service', () => {
  let service: StudentTaskService;
  let httpMock: HttpTestingController;
  let expectedResult: IStudentTask | IStudentTask[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StudentTaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a StudentTask', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const studentTask = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(studentTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StudentTask', () => {
      const studentTask = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(studentTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StudentTask', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StudentTask', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StudentTask', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStudentTaskToCollectionIfMissing', () => {
      it('should add a StudentTask to an empty array', () => {
        const studentTask: IStudentTask = sampleWithRequiredData;
        expectedResult = service.addStudentTaskToCollectionIfMissing([], studentTask);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentTask);
      });

      it('should not add a StudentTask to an array that contains it', () => {
        const studentTask: IStudentTask = sampleWithRequiredData;
        const studentTaskCollection: IStudentTask[] = [
          {
            ...studentTask,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStudentTaskToCollectionIfMissing(studentTaskCollection, studentTask);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StudentTask to an array that doesn't contain it", () => {
        const studentTask: IStudentTask = sampleWithRequiredData;
        const studentTaskCollection: IStudentTask[] = [sampleWithPartialData];
        expectedResult = service.addStudentTaskToCollectionIfMissing(studentTaskCollection, studentTask);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentTask);
      });

      it('should add only unique StudentTask to an array', () => {
        const studentTaskArray: IStudentTask[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const studentTaskCollection: IStudentTask[] = [sampleWithRequiredData];
        expectedResult = service.addStudentTaskToCollectionIfMissing(studentTaskCollection, ...studentTaskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const studentTask: IStudentTask = sampleWithRequiredData;
        const studentTask2: IStudentTask = sampleWithPartialData;
        expectedResult = service.addStudentTaskToCollectionIfMissing([], studentTask, studentTask2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentTask);
        expect(expectedResult).toContain(studentTask2);
      });

      it('should accept null and undefined values', () => {
        const studentTask: IStudentTask = sampleWithRequiredData;
        expectedResult = service.addStudentTaskToCollectionIfMissing([], null, studentTask, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentTask);
      });

      it('should return initial array if no StudentTask is added', () => {
        const studentTaskCollection: IStudentTask[] = [sampleWithRequiredData];
        expectedResult = service.addStudentTaskToCollectionIfMissing(studentTaskCollection, undefined, null);
        expect(expectedResult).toEqual(studentTaskCollection);
      });
    });

    describe('compareStudentTask', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStudentTask(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStudentTask(entity1, entity2);
        const compareResult2 = service.compareStudentTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStudentTask(entity1, entity2);
        const compareResult2 = service.compareStudentTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStudentTask(entity1, entity2);
        const compareResult2 = service.compareStudentTask(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
