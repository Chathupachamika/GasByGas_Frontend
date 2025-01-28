import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
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
  showForgotPasswordModal = false;
  resetEmail: string = '';
  showOtpModal = false;
  otpControls: FormControl[] = Array(6).fill(null).map(() => new FormControl(''));
  remainingTime = 0;
  timerInterval: any;
  showPasswordResetModal = false;
  newPassword: string = '';
  confirmPassword: string = '';

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

  onForgotPasswordSubmit(): void {
    if (this.resetEmail) {
      // First verify if email exists
      this.loginService.searchByEmail(this.resetEmail).subscribe({
        next: (userExists) => {
          if (userExists) {
            // If email exists, send OTP
            this.loginService.requestPasswordReset(this.resetEmail).subscribe({
              next: () => {
                console.log('OTP sent successfully');
                this.showForgotPasswordModal = false;
                this.showOtpModal = true;
                this.startOtpTimer();
                this.otpControls.forEach(control => control.setValue(''));
                alert('OTP has been sent to your email');
              },
              error: (error) => {
                console.error('Error sending OTP:', error);
                alert('Failed to send OTP. Please try again.');
              }
            });
          } else {
            alert('Email address not found. Please check your email.');
          }
        },
        error: (error) => {
          console.error('Email verification failed:', error);
          alert('Email address not found. Please check your email.');
        }
      });
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
      const otp = this.otpControls.map(control => control.value).join('');
      
      // Verify OTP first
      this.loginService.verifyOTP(this.resetEmail, otp).subscribe({
        next: () => {
          console.log('OTP verified successfully');
          this.showOtpModal = false;
          this.showPasswordResetModal = true;
        },
        error: (error) => {
          console.error('OTP verification failed:', error);
          alert('Invalid OTP. Please try again.');
        }
      });
    }
  }

  resetPassword(): void {
    if (this.newPassword === this.confirmPassword) {
      this.loginService.resetPassword(this.resetEmail, this.newPassword).subscribe({
        next: () => {
          console.log('Password reset successful');
          this.showPasswordResetModal = false;
          alert('Password reset successful! Please login with your new password.');
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          alert('Failed to reset password. Please try again.');
        }
      });
    } else {
      alert('Passwords do not match!');
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

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
