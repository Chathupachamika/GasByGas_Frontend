import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrected property name
})
export class SidebarComponent implements OnInit { // Added 'implements' keyword
  userDetails: any = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      const userDetailsStr = localStorage.getItem('userDetails');
      if (userDetailsStr) {
        this.userDetails = JSON.parse(userDetailsStr);
        console.log('Logged in user details:', this.userDetails);
      }
    }
  }
}
