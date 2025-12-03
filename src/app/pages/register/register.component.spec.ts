import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: jest.Mocked<UserService>;
  let routerMock: jest.Mocked<Router>;
  let alertSpy: jest.SpyInstance;

  beforeEach(async () => {
    userServiceMock = {
      register: jest.fn(),
      login: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  it('should create form and be invalid at start', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should call UserService.register and navigate to login on success', () => {
    userServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john',
      password: 'pwd',
    });

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not call register when form is invalid', () => {
    component.registerForm.patchValue({
      firstName: '',
      lastName: 'Doe',
      login: 'john',
      password: 'pwd'
    });

    const registerSpy = jest.spyOn(userServiceMock, 'register');

    component.onSubmit();

    expect(registerSpy).not.toHaveBeenCalled();
  });

  it('should handle error when register fails', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john',
      password: 'pwd'
    });

    const errorResponse = { error: { message: 'Erreur serveur' } };

    const registerSpy = jest.spyOn(userServiceMock, 'register')
      .mockReturnValue(throwError(() => errorResponse));

    const navigateSpy = jest.spyOn(routerMock, 'navigate').mockResolvedValue(true);

    component.onSubmit();

    expect(registerSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Une erreur est survenue.');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
