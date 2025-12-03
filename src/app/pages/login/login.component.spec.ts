import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: jest.Mocked<UserService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    userServiceMock = {
      login: jest.fn(),
      register: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with login and password controls', () => {
    expect(component.LoginForm.contains('login')).toBe(true);
    expect(component.LoginForm.contains('password')).toBe(true);
    expect(component.LoginForm.valid).toBe(false);
  });

  it('should call UserService.login and store token on valid submit', () => {
    const token = 'jwt.token';
    userServiceMock.login.mockReturnValue(of(token));

    component.LoginForm.setValue({ login: 'john', password: 'pwd' });

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith({
      login: 'john',
      password: 'pwd',
    });
    expect(localStorage.getItem('token')).toBe(token);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should set errorMessage when login fails', () => {
    userServiceMock.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Bad credentials' } }))
    );

    component.LoginForm.setValue({ login: 'john', password: 'wrong' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Bad credentials');
  });

  it('should not call login when form is invalid', () => {
    component.LoginForm.patchValue({
      login: '',
      password: 'pwd'
    });

    const loginSpy = jest.spyOn(userServiceMock, 'login');

    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
  });

});
