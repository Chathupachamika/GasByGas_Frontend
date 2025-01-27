import { Component } from '@angular/core';
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
    this.user = {
      ...this.user,
      ...this.loginForm.value
    };

    if (this.loginForm.valid) {
      // Call the LoginService to handle login
      this.loginService.loginUser(this.user).subscribe({
        next: (response) => {
          alert('Login successful!');
          console.log(response);
          this.router.navigate(['/admin-dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Login failed. Please check your credentials.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  // Optional: Method to handle social login
  // socialLogin(provider: 'google' | 'facebook') {
  //   this.loginService.socialLogin(provider).subscribe({
  //     next: (response) => {
  //       alert(`${provider} login successful!`);
  //       console.log(response);
  //       // Handle successful social login
  //     },
  //     error: (error) => {
  //       console.error(`${provider} login failed`, error);
  //       alert(`${provider} login failed. Please try again.`);
  //     }
  //   });
  // }
}
