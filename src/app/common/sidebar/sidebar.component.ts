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
    if (this.loginService.isLoggedIn()) {
      const userDetailsStr = localStorage.getItem('userDetails');
      if (userDetailsStr) {
        this.userDetails = JSON.parse(userDetailsStr);
        console.log('Logged in user details:', this.userDetails);
        console.log('User name:', this.userDetails.name); // Added line to log user's name
      }
    }
  }
}
