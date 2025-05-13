import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../cognito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  formData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address1: '',
    address2: '',
    plan: 'personal' as 'personal' | 'startup' | 'enterprise',
    frequency: 'monthly' as 'monthly' | 'yearly',
    startupName: '',
    enterpriseName: ''
  };

  formSubmitted = false;
  passwordStrength = '';
  passwordErrors: string[] = [];
  passwordMismatch = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) { }

  onPlanChange() {
    if (this.formData.plan === 'startup') {
      this.formData.enterpriseName = '';
    } else if (this.formData.plan === 'enterprise') {
      this.formData.startupName = '';
    }
  }

  checkPasswordStrength() {
    const password = this.formData.password;
    this.passwordErrors = [];
    this.passwordStrength = '';

    if (!password) return;

    const requirements = [
      { test: password.length >= 8, message: "At least 8 characters" },
      { test: /[A-Z]/.test(password), message: "One uppercase letter" },
      { test: /[a-z]/.test(password), message: "One lowercase letter" },
      { test: /\d/.test(password), message: "One number" },
      { test: /[^A-Za-z0-9]/.test(password), message: "One special character" }
    ];

    this.passwordErrors = requirements.filter(req => !req.test).map(req => req.message);
    const strengthPoints = requirements.filter(req => req.test).length;

    this.passwordStrength =
      strengthPoints <= 2 ? 'Weak' :
        strengthPoints <= 4 ? 'Medium' : 'Strong';
  }

  checkPasswordMatch() {
    this.passwordMismatch = this.formData.password !== this.formData.confirmPassword;
  }

  async onSubmit() {
    this.formSubmitted = true;
    this.checkPasswordStrength();
    this.checkPasswordMatch();

    if (this.passwordErrors.length > 0 || this.passwordMismatch ||
      !this.formData.email || !this.formData.fullName) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = {
        email: this.formData.email,
        password: this.formData.password,
        name: this.formData.fullName,
        phoneNumber: this.formData.phone,
        // Include custom attributes
        customAttributes: {
          address: `${this.formData.address1} ${this.formData.address2}`.trim(),
          plan: this.formData.plan,
          billing_frequency: this.formData.frequency,
          ...(this.formData.plan === 'startup' && { startup_name: this.formData.startupName }),
          ...(this.formData.plan === 'enterprise' && { enterprise_name: this.formData.enterpriseName })
        }
      };

      await this.cognitoService.signUp(user).toPromise();

      this.router.navigate(['/confirmationCode'], {
        state: {
          email: this.formData.email,
          formData: this.formData
        }
      });
    } catch (error: any) {
      this.errorMessage = this.getFriendlyErrorMessage(error);
      console.error('Sign up error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getFriendlyErrorMessage(error: any): string {
    const message = error.message || '';
    if (message.includes('User already exists')) {
      return 'An account with this email already exists';
    }
    if (message.includes('Password did not conform')) {
      return 'Password must contain: 8+ chars, uppercase, lowercase, number, and special character';
    }
    if (message.includes('Invalid phone number format')) {
      return 'Please enter a valid phone number (e.g., 50187997)';
    }
    return 'Registration failed. Please try again.';
  }
}