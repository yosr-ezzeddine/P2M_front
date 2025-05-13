import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../cognito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  formSubmitted: boolean = false;
  showMFAField: boolean = false;
  mfaCode: string = '';

  // Enhanced error handling
  errors = {
    email: '',
    password: '',
    mfa: '',
    general: ''
  };

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) { }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;
    this.resetErrors();

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      if (this.showMFAField) {
        // Handle MFA verification
        await this.handleMFACode();
      } else {
        // Initial sign-in attempt
        await this.handleInitialSignIn();
      }
    } catch (error: any) {
      this.handleAuthenticationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleInitialSignIn(): Promise<void> {
    const result = await this.cognitoService.signIn({
      email: this.email,
      password: this.password
    }).toPromise();

    if (!result) {
      throw new Error('No response received from authentication service');
    }

    // Handle MFA case
    if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
      this.showMFAField = true;
      const destination = result.nextStep.codeDeliveryDetails?.destination || 'your device';
      this.errors.general = `Enter the code sent to ${this.maskPhoneNumber(destination)}`;
      return;
    }

    // Handle successful sign-in
    if (result.isSignedIn) {
      this.router.navigate(['/home']);
      return;
    }

    throw new Error('Unexpected authentication state');
  }

  private maskPhoneNumber(phone: string): string {
    // Masks most digits for privacy (e.g., +216••••••97)
    return phone.replace(/(\+\d{3})(\d{3})(\d{2})(\d{2})/, '$1••••••$3$4');
  }

  private async handleMFACode(): Promise<void> {
    await this.cognitoService.confirmMFACode(this.mfaCode, 'SMS').toPromise();
    this.router.navigate(['/home']);
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.email) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!this.showMFAField && !this.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    }

    if (this.showMFAField && !this.mfaCode) {
      this.errors.mfa = 'Verification code is required';
      isValid = false;
    }

    return isValid;
  }

  private handleAuthenticationError(error: any): void {
    console.error('Authentication error:', error);
    this.resetErrors();

    const errorMessage = error.message || error.toString();

    if (errorMessage.includes('Incorrect username or password')) {
      this.errors.general = 'Invalid email or password';
      this.errors.email = 'Please check your email';
      this.errors.password = 'Please check your password';

    } else if (errorMessage.includes('User is not confirmed')) {
      this.errors.general = 'Please verify your email first';
      this.router.navigate(['/confirm'], { state: { email: this.email } });

    } else if (errorMessage.includes('Invalid MFA code')) {
      this.showMFAField = true;
      this.errors.mfa = 'Invalid verification code. Please try again.';

    } else {
      this.errors.general = 'Login failed. Please try again.';
    }
  }

  private resetErrors(): void {
    this.errors = {
      email: '',
      password: '',
      mfa: '',
      general: ''
    };
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password'], { state: { email: this.email } });
  }

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }
}