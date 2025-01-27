import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any = null;
  showProfilePopup = false;
  editedUserDetails: any = {};

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      this.editedUserDetails = { ...this.userDetails };
      console.log('Loaded user details:', this.userDetails);
    }
  }

  toggleProfilePopup(): void {
    this.showProfilePopup = !this.showProfilePopup;
    if (this.showProfilePopup) {
      this.editedUserDetails = { ...this.userDetails };
    }
  }

  closePopup(): void {
    this.showProfilePopup = false;
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getUserRole(): string {
    if (this.userDetails?.roles?.length > 0) {
      return this.userDetails.roles[0].replace('ROLE_', '');
    }
    return '';
  }

  updateProfile(): void {
    // Here you would typically call your API to update the user details
    this.loginService.updateUser(this.editedUserDetails).subscribe({
      next: (response) => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(response));
        this.closePopup();
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}
