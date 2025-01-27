import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../service/login.service';
import { LoginModel } from '../../model/login.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginModel = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.loginService.loginUser(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          // After successful login, fetch user details by email
          this.loginService.searchByEmail(loginData.email).subscribe({
            next: (userDetails) => {
              localStorage.setItem('userDetails', JSON.stringify(userDetails));
              console.log('User details saved:', userDetails);
              alert('Login successful!');
              this.router.navigate(['/admin-dashboard']);
            },
            error: (error) => {
              console.error('Error fetching user details:', error);
              // Still navigate even if fetching additional details fails
              this.router.navigate(['/admin-dashboard']);
            }
          });
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loginError = 'Login failed. Please check your credentials.';
          alert(this.loginError);
        }
      });
    } else {
      this.loginError = 'Please fill in all required fields correctly.';
      alert(this.loginError);
    }
  }
}
