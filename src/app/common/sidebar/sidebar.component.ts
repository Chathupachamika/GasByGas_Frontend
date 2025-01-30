import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Add this import

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userDetails: any = null;
  sidebarExpanded = false;

  constructor(private loginService: LoginService, private router: Router) { }

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

  confirmLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of the system!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      customClass: {
        container: 'sweet-alert-center'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  }

  private logout(): void {
    // Clear user data
    localStorage.removeItem('userDetails');
    localStorage.removeItem('token');

    // Use the login service to handle any additional logout logic
    this.loginService.logout();

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  expandSidebar() {
    this.sidebarExpanded = true;
  }

  collapseSidebar() {
    this.sidebarExpanded = false;
  }
}
