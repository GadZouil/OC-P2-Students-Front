import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/students';

  beforeEach(() => {
    // on prépare un token en localStorage pour tester les headers
    localStorage.setItem('token', 'fake.jwt.token');

    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      providers: [StudentService],
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('getAll() should call GET /api/students with Authorization header', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Tom', lastName: 'Thumb', email: 'tom@mail.com' },
    ];

    service.getAll().subscribe(students => {
      expect(students.length).toBe(1);
      expect(students[0].firstName).toBe('Tom');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake.jwt.token');

    req.flush(mockStudents);
  });

  it('create() should call POST /api/students', () => {
    const student: Student = {
      id: undefined,
      firstName: 'Anna',
      lastName: 'Smith',
      email: 'anna@mail.com',
    };

    service.create(student).subscribe(returned => {
      expect(returned.email).toBe('anna@mail.com');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(student);

    req.flush({ ...student, id: 10 });
  });

  it('update() should call PUT /api/students/:id', () => {
    const updated: Student = {
      id: 5,
      firstName: 'Bob',
      lastName: 'New',
      email: 'bob@mail.com',
    };

    service.update(5, updated).subscribe(res => {
      expect(res.firstName).toBe('Bob');
    });

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('delete() should call DELETE /api/students/:id', () => {
    service.delete(3).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
