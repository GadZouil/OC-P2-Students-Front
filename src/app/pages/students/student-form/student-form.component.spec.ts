import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../../core/models/Student';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;
  let routerMock: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    studentServiceMock = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, ReactiveFormsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(null), // par défaut : pas d'id → création
              },
            },
          },
        },
      ],
    }).compileComponents();

    mockActivatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a new student when no id in route', () => {
    studentServiceMock.create.mockReturnValue(
      of({ id: 1, firstName: 'Tom', lastName: 'Thumb', email: 'tom@mail.com' })
    );

    component.form.setValue({
      firstName: 'Tom',
      lastName: 'Thumb',
      email: 'tom@mail.com',
    });

    component.onSubmit();

    expect(studentServiceMock.create).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should load student and call update when submitting in edit mode', () => {
    const existingStudent: Student = {
      id: 5,
      firstName: 'Tom',
      lastName: 'Thumb',
      email: 'tom@mail.com'
    };

    // = /students/5 → paramMap.get('id') = "5"
    (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue('5');

    studentServiceMock.getById.mockReturnValue(of(existingStudent));
    studentServiceMock.update.mockReturnValue(of(existingStudent));

    component.ngOnInit();
    fixture.detectChanges();

    component.form.patchValue({
      firstName: 'Tommy',
      lastName: 'Thumb',
      email: 'tom@mail.com'
    });

    component.onSubmit();

    expect(studentServiceMock.update).toHaveBeenCalledWith(5, {
      firstName: 'Tommy',
      lastName: 'Thumb',
      email: 'tom@mail.com'
    });
  });
});
