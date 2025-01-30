import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
<<<<<<< HEAD:src/app/common/login/login.component.ts
import { LoginService } from '../../service/login.service';
import { LoginModel } from '../../model/login.model';
=======
import { LoginService } from '../../../service/login.service';
import { LoginModel } from '../../../model/login.model';
import Swal from 'sweetalert2';

>>>>>>> 341ee4e50e8a00a330b2cd3314089ea695e6cef0:src/app/admin/components/login/login.component.ts
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
  showForgotPasswordModal = false;
  resetEmail: string = '';
  showOtpModal = false;
  otpControls: FormControl[] = Array(6).fill(null).map(() => new FormControl(''));
  remainingTime = 0;
  timerInterval: any;
  showPasswordResetModal = false;
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword = false;

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
          // After successful login, fetch user details by email
          this.loginService.searchByEmail(loginData.email).subscribe({
            next: (userDetails) => {
              localStorage.setItem('userDetails', JSON.stringify(userDetails));
              console.log('User details saved:', userDetails);
              
              Swal.fire({
                title: 'Success!',
                text: 'Login successful!',
                icon: 'success',
                confirmButtonText: 'Continue',
                customClass: {
                  container: 'my-swal-container',
                  popup: 'my-swal-popup',
                  confirmButton: 'my-swal-confirm-button'
                }
              }).then(() => {
                this.router.navigate(['/admin-dashboard']);
              });
            },
            error: (error) => {
              console.error('Error fetching user details:', error);
              Swal.fire({
                title: 'Warning',
                text: 'Logged in but unable to fetch user details',
                icon: 'warning',
                confirmButtonText: 'Continue'
              }).then(() => {
                this.router.navigate(['/admin-dashboard']);
              });
            }
          });
        },
        error: (error) => {
          console.error('Login error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Login failed. Please check your credentials.',
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }
  }

  onForgotPasswordSubmit(): void {
    if (this.resetEmail) {
      // Simply show OTP modal
      this.showForgotPasswordModal = false;
      this.showOtpModal = true;
      this.startOtpTimer();
      this.otpControls.forEach(control => control.setValue(''));
    } else {
      alert('Please enter your email address');
    }
  }

  startOtpTimer(): void {
    this.remainingTime = 60;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onOtpInput(event: any, index: number): void {
    const input = event.target;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    if (input.value.length === 1 && nextInput && index < 5) {
      nextInput.focus();
    }

    if (input.value.length === 0 && prevInput && index > 0) {
      prevInput.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (pastedData) {
      const otpArray = pastedData.slice(0, 6).split('');
      this.otpControls.forEach((control, index) => {
        control.setValue(otpArray[index] || '');
      });
    }
  }

  isOtpValid(): boolean {
    return this.otpControls.every(control => control.value?.length === 1);
  }

  verifyOtp(): void {
    if (this.isOtpValid()) {
      // Simply show password reset modal
      this.showOtpModal = false;
      this.showPasswordResetModal = true;
    }
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all password fields',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'my-swal-container',
          popup: 'my-swal-popup',
          confirmButton: 'my-swal-confirm-button'
        }
      });
      return;
    }

    if (this.newPassword === this.confirmPassword) {
      Swal.fire({
        title: 'Success!',
        text: 'Password reset successful! Please login with your new password.',
        icon: 'success',
        confirmButtonText: 'Continue',
        customClass: {
          container: 'my-swal-container',
          popup: 'my-swal-popup',
          confirmButton: 'my-swal-confirm-button'
        }
      }).then(() => {
        this.showPasswordResetModal = false;
        this.newPassword = '';
        this.confirmPassword = '';
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match!',
        icon: 'error',
        confirmButtonText: 'Try Again',
        customClass: {
          container: 'my-swal-container',
          popup: 'my-swal-popup',
          confirmButton: 'my-swal-confirm-button'
        }
      });
    }
  }

  resendOtp(): void {
    if (this.remainingTime === 0) {
      // Call your API to resend OTP
      console.log('Resending OTP to:', this.resetEmail);
      this.startOtpTimer();
    }
  }

  // Add new method to handle back button in OTP view
  backToEmailForm(): void {
    this.showOtpModal = false;
    this.showForgotPasswordModal = true;
    clearInterval(this.timerInterval);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
