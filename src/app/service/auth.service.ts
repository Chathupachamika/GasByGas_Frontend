import { Injectable } from '@angular/core';

export interface UserDetails {
  userName: string;
  contactNumber: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getLoggedInUserDetails(): UserDetails {
    // Get user details from localStorage or your auth state
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      userName: user.userName || '',
      contactNumber: user.contactNumber || '',
      email: user.email || ''
    };
  }
}
