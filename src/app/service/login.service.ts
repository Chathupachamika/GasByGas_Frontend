import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from '../model/register.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/register';
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  addUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-user`, formData);
  }

  getAll(): Observable<RegisterModel[]> {
    return this.http.get<RegisterModel[]>(`${this.apiUrl}/get-all`);
  }

  getFaculties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/faculty/get-allFaculty`);
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-user`, formData);
  }

  loginUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, formData);
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    const requestBody = { email };
    return this.http.post(`${this.baseUrl}/forgot-password/post`, requestBody);
  }
}
