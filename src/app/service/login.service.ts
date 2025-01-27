import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from '../model/login.model';
import { LoginModel } from '../model/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:8080';
  private authEndpoint = `${this.baseUrl}/auth`;
  private userEndpoint = `${this.baseUrl}/users`;
  private tokenKey = 'jwtToken';

  constructor(private http: HttpClient) {}

  createUser(userData: UserModel): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.userEndpoint}`, userData, { headers }).pipe(
      tap((response: any) => {
        // Store user details in localStorage after successful registration
        if (response) {
          localStorage.setItem('userDetails', JSON.stringify(response));
          console.log('User details saved after registration:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  loginUser(credentials: LoginModel): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.authEndpoint}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.saveToken(response.token);
          // Store user details in localStorage after successful login
          if (response.user) {
            localStorage.setItem('userDetails', JSON.stringify(response.user));
            console.log('User details saved after login:', response.user);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userDetails');
    console.log('User logged out, details cleared from localStorage');
  }
}
