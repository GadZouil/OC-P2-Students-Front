import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../core/service/student.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    studentServiceMock = {
      getById: jest.fn().mockReturnValue(of({
        id: 1,
        firstName: 'Tom',
        lastName: 'Thumb',
        email: 'tom@mail.com'
      }))
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) }
          }
        },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
  });
});
