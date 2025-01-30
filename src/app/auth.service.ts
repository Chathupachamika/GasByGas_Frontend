import { Injectable } from '@angular/core';
import { UserRole } from './user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private userRole: UserRole | null = null;

  // Simulate login (you would replace this with actual login logic)
  login(role: UserRole): void {
    this.isLoggedIn = true;
    this.userRole = role;
  }

  // Simulate logout
  logout(): void {
    this.isLoggedIn = false;
    this.userRole = null;
  }

  // Check if the user is logged in
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  // Get the current user's role
  getUserRole(): UserRole | null {
    return this.userRole;
  }
}
