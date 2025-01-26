import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../service/login.service';
import { RegisterModel } from '../../model/register.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  user: RegisterModel = {
    userId: '',
    mobileNumber: '',
    name: '',
    password: '',
    termsConditions: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.registerForm = this.formBuilder.group({
      userId: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      termsConditions: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    this.user = {
      ...this.user,
      ...this.registerForm.value
    };

    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.user).forEach(key => {
        const value = this.user[key as keyof RegisterModel];
        formData.append(key, typeof value === 'boolean' ? value.toString() : value || '');
      });

      // Call the LoginService to handle registration
      this.loginService.createUser(formData).subscribe({
        next: (response: any) => {
          alert('Registration successful!');
          console.log('Server Response:', response);
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
