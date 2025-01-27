import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userDetails: any = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Get the stored user details from localStorage
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      console.log('Loaded user details:', this.userDetails);
    }
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // Method to get user role
  getUserRole(): string {
    if (this.userDetails && this.userDetails.roles && this.userDetails.roles.length > 0) {
      // Remove 'ROLE_' prefix if present
      return this.userDetails.roles[0].replace('ROLE_', '');
    }
    return '';
  }
}
