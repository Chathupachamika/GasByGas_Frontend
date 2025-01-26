import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:8080';
  private authEndpoint = `${this.baseUrl}/auth`;
  private userEndpoint = `${this.baseUrl}/users`;
  private tokenKey = 'jwtToken'; // Key to store the token in localStorage

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   */
  createUser(userData: any): Observable<any> {
    const body = JSON.stringify(userData); // Create JSON payload
    return this.http.post(`${this.userEndpoint}`, body, { headers: { 'Content-Type': 'application/json' } }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Log in a user and store JWT token in localStorage
   */
  loginUser(credentials: { username: string; password: string }): Observable<any> {
    const body = JSON.stringify(credentials);
    return this.http.post(`${this.authEndpoint}/login`, body, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap((response: any) => {
        const token = response?.token; // Assuming the API returns `{ token: "JWT_TOKEN" }`
        if (token) {
          this.saveToken(token);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch all registered users
   */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.userEndpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Save the JWT token to localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Retrieve the JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if the user is logged in (valid token exists in localStorage)
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Remove the JWT token from localStorage to log out the user
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
