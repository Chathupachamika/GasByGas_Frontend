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

  searchByEmail(email: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.userEndpoint}/email/${email}`, { headers }).pipe(
      tap((response: any) => {
        if (response) {
          console.log('User details fetched by email:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  updateUser(userData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.userEndpoint}/${userData.id}`, userData, { headers }).pipe(
      tap((response: any) => {
        if (response) {
          localStorage.setItem('userDetails', JSON.stringify(response));
          console.log('User details updated:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  searchById(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.userEndpoint}/${id}`, { headers }).pipe(
      tap((response: any) => {
        if (response) {
          console.log('User details fetched by ID:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.get(`${this.userEndpoint}/verify-email/${email}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Email not found'));
        }
        return throwError(() => error);
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password/request-reset`, { email }, 
    { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password/verify-otp`, 
      { email, otp }, 
      { responseType: 'text' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password/reset`, 
      { email, newPassword }, 
      { responseType: 'text' }
    ).pipe(
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