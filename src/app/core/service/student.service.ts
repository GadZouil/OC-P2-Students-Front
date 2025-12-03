import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  // private baseUrl = 'http://localhost:8080/api/students';
  private baseUrl = '/api/students';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
