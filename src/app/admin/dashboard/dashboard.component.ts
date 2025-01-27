import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HeaderComponent } from "../../common/header/header.component";
import { SidebarComponent } from "../../common/sidebar/sidebar.component";
import { LoginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // added to recognize custom elements
})
export class DashboardComponent implements OnInit {
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
