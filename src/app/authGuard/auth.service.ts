import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userDetails');
  }

  getUserRole(): string | null {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      // Assuming the role is stored in the format "ROLE_ADMIN", "ROLE_USER", etc.
      const roleWithPrefix = user.roles?.[0];
      return roleWithPrefix ? roleWithPrefix.replace('ROLE_', '') : null;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('userDetails');
    this.router.navigate(['/login']);
  }

  getRedirectUrl(role: string): string {
    switch (role) {
      case 'ADMIN':
        return '/admin-dashboard';
      case 'MODERATOR':
        return '/moderator-dashboard';
      case 'USER':
        return '/dashboard';
      default:
        return '/login';
    }
  }
}
