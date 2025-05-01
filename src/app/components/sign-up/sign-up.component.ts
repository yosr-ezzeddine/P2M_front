import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importations nécessaires
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CognitoService } from '../../cognito.service';
@Component({
  selector: 'app-sign-up',
  
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  formData: any = {
    fullName: '',
    email: '',
    password: '',
    confirmpassword: '',
    phone: '',
    address1: '',
    address2: '',
    plan: '',
    frequency:'',
    startupName: '',
    enterpriseName: ''
  };
  formSubmitted = false;
  constructor(private router: Router, private congnitoService: CognitoService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any, preserveFormData?: boolean };

    if (state?.preserveFormData && state.formData) {
      this.formData = { ...this.formData, ...state.formData };
    }
  }
  onPlanChange() {
    // Optionally reset conditional fields
    if (this.formData.plan === 'startup') {
      this.formData.enterpriseName = '';
    } else if (this.formData.plan === 'enterprise') {
      this.formData.startupName = '';
    } else {
      this.formData.startupName = '';
      this.formData.enterpriseName = '';
    }
  }
  passwordStrength: string = '';
  passwordErrors: string[] = [];
  passwordMismatch: boolean = false;

  checkPasswordStrength() {
    const password = this.formData.password;
    this.passwordErrors = [];

    // Réinitialiser la force
    this.passwordStrength = '';

    if (!password) return;

    // Vérifications de sécurité
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Messages d'erreur
    if (!hasMinLength) this.passwordErrors.push("Password must be at least 8 characters long");
    if (!hasUpperCase) this.passwordErrors.push("Password must contain at least one uppercase letter");
    if (!hasLowerCase) this.passwordErrors.push("Password must contain at least one lowercase letter");
    if (!hasNumbers) this.passwordErrors.push("Password must contain at least one number");
    if (!hasSpecialChars) this.passwordErrors.push("Password must contain at least one special character");

    // Déterminer la force
    const strengthPoints = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars
    ].filter(Boolean).length;

    if (strengthPoints <= 2) {
      this.passwordStrength = 'Weak';
    } else if (strengthPoints <= 4) {
      this.passwordStrength = 'Medium';
    } else {
      this.passwordStrength = 'Strong';
    }
  }

  checkPasswordMatch() {
    this.passwordMismatch = this.formData.password !== this.formData.confirmpassword;
  }
  onSubmit() {
    this.formSubmitted = true;
    this.checkPasswordStrength();
    this.checkPasswordMatch();

    if (this.passwordErrors.length > 0 || this.passwordMismatch) {
      // Afficher un message d'erreur global
      return;
    }

    this.router.navigate(['/payment'], {
      state: {
        formData: this.formData,
        plan: this.formData.plan
      }
    });
  }
}

