import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { LoginModel } from '../../model/login.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  user: LoginModel = {
    username: '',
    password: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.user = { ...this.user, ...this.loginForm.value };

      const formData = new FormData();
      formData.append('username', this.user.username);
      formData.append('password', this.user.password);

      this.loginService.loginUser(formData).subscribe({
        next: (response) => {
          // Store token or user info in local storage
          localStorage.setItem('authToken', response.token);
          // Navigate to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert(error.error.message || 'Login failed. Please check your credentials.');
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // socialLogin(provider: 'google' | 'facebook') {
  //   // Implement social login logic
  //   this.loginService.socialLogin(provider).subscribe({
  //     next: (response) => {
  //       localStorage.setItem('authToken', response.token);
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       console.error(`${provider} login failed`, error);
  //       alert(`${provider} login failed. Please try again.`);
  //     }
  //   });
  // }
}
