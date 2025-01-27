import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginService } from '../service/login.service';

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserDetails | null>;
  public currentUser: Observable<UserDetails | null>;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('userDetails');
    this.currentUserSubject = new BehaviorSubject<UserDetails | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  getCurrentUser(): UserDetails | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('ROLE_ADMIN') || false;
  }

  isModerator(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('ROLE_MODERATOR') || false;
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('ROLE_USER') || false;
  }

  updateCurrentUser(user: UserDetails) {
    this.currentUserSubject.next(user);
  }

  logout() {
    this.loginService.logout();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  redirectBasedOnRole() {
    const user = this.getCurrentUser();
    if (!user) return;

    if (user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.roles.includes('ROLE_MODERATOR')) {
      this.router.navigate(['/moderator/dashboard']);
    } else {
      this.router.navigate(['/user/dashboard']);
    }
  }
}
