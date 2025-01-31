import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  userDetails: any = null;
  sidebarExpanded = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      console.log('Loaded user details:', this.userDetails);
    }
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getUserRole(): string {
    if (this.userDetails && this.userDetails.roles && this.userDetails.roles.length > 0) {
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
    localStorage.removeItem('userDetails');
    localStorage.removeItem('token');
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  expandSidebar() {
    this.sidebarExpanded = true;
  }

  collapseSidebar() {
    this.sidebarExpanded = false;
  }
}

