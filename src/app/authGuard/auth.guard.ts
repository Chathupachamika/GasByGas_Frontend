import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userDetails = this.authService.getCurrentUser();

    if (!userDetails) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    // Check if route requires specific roles
    if (route.data['roles'] && route.data['roles'].length) {
      const userRoles = userDetails.roles.map(role => role.replace('ROLE_', ''));
      if (!route.data['roles'].some((role: string) => userRoles.includes(role))) {
        // Role not authorized, redirect to home page
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
