import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, MFAType } from '../../cognito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-mfacode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfacode.component.html',
  styleUrls: ['./mfacode.component.css']
})
  export class MFACodeComponent {
  otpCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  remainingAttempts: number | null = null;
  resendEnabled: boolean = false;
  resendCountdown: number = 30;
  mfaType!: MFAType;
  destination?: string;

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.mfaType = state?.['type'] || 'SMS';
    this.destination = state?.['destination'];
    this.startResendCountdown();
  }

  async onSubmit() {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.cognitoService.confirmMFACode(this.otpCode, this.mfaType).toPromise();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.handleMfaError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleMfaError(error: any) {
    console.error('MFA Error:', error);

    if (error.message.includes('Invalid code')) {
      this.remainingAttempts = this.getRemainingAttempts(error);
      this.errorMessage = this.remainingAttempts
        ? `Invalid code. ${this.remainingAttempts} attempts remaining.`
        : 'Invalid code. No attempts remaining.';
    } else if (error.message.includes('Expired code')) {
      this.errorMessage = 'This code has expired. Please request a new one.';
    } else {
      this.errorMessage = 'Verification failed. Please try again.';
    }
  }

  private getRemainingAttempts(error: any): number | null {
    const message = error.message || '';
    const match = message.match(/attempts remaining: (\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  async resendCode() {
    if (!this.resendEnabled || this.mfaType !== 'SMS') return;

    this.resendEnabled = false;
    this.resendCountdown = 30;
    this.startResendCountdown();

    try {
      // Implement SMS resend logic here
      // Note: You'll need to add a resendSMS() method in CognitoService
      await this.cognitoService.resendSMSCode();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Failed to resend code. Please try again.';
      console.error('Resend failed:', error);
    }
  }

  private startResendCountdown() {
    const timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(timer);
        this.resendEnabled = true;
      }
    }, 1000);
  }
}