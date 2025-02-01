import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.authService.getUserRole();
    const allowedRoles = route.data['roles'] as Array<string>;

    if (!userRole || !allowedRoles || !allowedRoles.includes(userRole)) {
      if (userRole) {
        this.router.navigate([this.authService.getRedirectUrl(userRole)]);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
}
