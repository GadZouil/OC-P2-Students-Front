import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;

  beforeEach(async () => {
    studentServiceMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [{ provide: StudentService, useValue: studentServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
  });

  it('should load students on init', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Tom', lastName: 'Thumb', email: 'tom@mail.com' },
    ];
    studentServiceMock.getAll.mockReturnValue(of(mockStudents));

    fixture.detectChanges(); // déclenche ngOnInit

    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students.length).toBe(1);
  });

  it('should set errorMessage when loading students fails', () => {
    const errorResponse = { error: { message: 'Erreur lors du chargement des étudiants' } };

    jest.spyOn(studentServiceMock, 'getAll')
      .mockReturnValue(throwError(() => errorResponse));

    fixture = TestBed.createComponent(StudentListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('Erreur lors du chargement des étudiants');
    expect(component.students.length).toBe(0);
  });

  it('should not call delete when user cancels confirmation', () => {
    const students = [
      { id: 1, firstName: 'Tom', lastName: 'Thumb', email: 'tom@mail.com' }
    ] as any[];

    jest.spyOn(studentServiceMock, 'getAll')
      .mockReturnValue(of(students));

    const deleteSpy = jest.spyOn(studentServiceMock, 'delete')
      .mockReturnValue(of(void 0));

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    fixture = TestBed.createComponent(StudentListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.delete(1);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

});
