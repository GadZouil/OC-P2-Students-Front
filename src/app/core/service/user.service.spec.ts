import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Register } from '../models/Register';
import { LoginRequest } from '../models/Login';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /api/register when register() is called', () => {
    const user: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'john',
      password: 'pwd',
    };

    service.register(user).subscribe();

    const req = httpMock.expectOne(req =>
      req.method === 'POST' && req.url === '/api/register'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe('/api/register');
    expect(req.request.body).toEqual(user);

    req.flush({});
  });

  it('should call POST /api/login and return a token as string', () => {
    const credentials: LoginRequest = {
      login: 'john',
      password: 'pwd',
    };
    const fakeToken = 'fake.jwt.token';

    let receivedToken: string | undefined;
    service.login(credentials).subscribe(token => {
      receivedToken = token;
    });

    const req = httpMock.expectOne(req =>
      req.method === 'POST' && req.url === '/api/login'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe('/api/login');
    expect(req.request.body).toEqual(credentials);

    req.flush(fakeToken);

    expect(receivedToken).toBe(fakeToken);
  });
});
