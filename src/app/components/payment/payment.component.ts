import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
type PlanType = 'personal' | 'startup' | 'enterprise';

interface PlanPricing {
  monthly: number;
  yearly: number;
}

interface FormData {
  plan: PlanType;
  frequency: 'monthly' | 'yearly';
  fullName: string;
  email: string;
  startupName?: string;
  enterpriseName?: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  selectedMethod: string = 'card';
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  cardName: string = '';
  cardType: string = '';
  nextBillingDate: string = '';

  formData: FormData = {
    plan: 'personal',
    frequency: 'monthly',
    fullName: '',
    email: ''
  };

  private readonly planPrices: Record<PlanType, PlanPricing> = {
    personal: { monthly: 35, yearly: 28 * 12 },
    startup: { monthly: 150, yearly: 130 * 12 },
    enterprise: { monthly: 300, yearly: 250 * 12 }
  };

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData };

    if (state?.formData) {
      this.formData = {
        ...this.formData,
        ...state.formData
      };
    }

    this.calculateNextBillingDate();
  }

  private calculateNextBillingDate(): void {
    const today = new Date();
    const nextDate = new Date(today);

    nextDate.setMonth(
      today.getMonth() +
      (this.formData.frequency === 'yearly' ? 12 : 1)
    );

    this.nextBillingDate = nextDate.toLocaleDateString('fr-FR');
  }

  // ... (autres méthodes restent inchangées)
  getPlanName(): string {
    const planNames: Record<PlanType, string> = {
      personal: 'Personal Plan',
      startup: 'Startup Plan',
      enterprise: 'Enterprise Plan'
    };
    return planNames[this.formData.plan];
  }

  getPlanPrice(): number {
    const pricing = this.planPrices[this.formData.plan];
    return this.formData.frequency === 'monthly' ? pricing.monthly : pricing.yearly;
  }

  getYearlyDiscount(): number {
    if (this.formData.frequency !== 'yearly') return 0;
    const pricing = this.planPrices[this.formData.plan];
    return (pricing.monthly * 12) - pricing.yearly;
  }

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  formatCardNumber(): void {
    let numbers = this.cardNumber.replace(/\D/g, '');

    if (/^4/.test(numbers)) {
      this.cardType = 'visa';
    } else if (/^5[1-5]/.test(numbers)) {
      this.cardType = 'mastercard';
    } else if (/^3[47]/.test(numbers)) {
      this.cardType = 'amex';
    } else {
      this.cardType = '';
    }

    if (this.cardType === 'amex') {
      this.cardNumber = numbers.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      this.cardNumber = numbers.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
  }

  formatExpiry(): void {
    this.cardExpiry = this.cardExpiry
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{0,2})/, '$1/$2')
      .substring(0, 5);
  }

  isPaymentValid(): boolean {
    if (this.selectedMethod === 'paypal') return true;

    const numbers = this.cardNumber.replace(/\D/g, '');
    const [month, year] = this.cardExpiry.split('/');

    const hasValidCardNumber = numbers.length >= 15;
    const hasValidExpiry = !!month && !!year && month.length === 2 && year.length === 2;
    const hasValidCvv = this.cardCvv.length >= 3;
    const hasValidName = this.cardName.trim().length > 0;

    return hasValidCardNumber && hasValidExpiry && hasValidCvv && hasValidName;
  }

  processPayment(): void {
    if (!this.isPaymentValid()) return;

    console.log('Processing payment...', {
      method: this.selectedMethod,
      plan: this.getPlanName(),
      frequency: this.formData.frequency,
      amount: this.getPlanPrice(),
      user: {
        name: this.formData.fullName,
        email: this.formData.email
      }
    });

    setTimeout(() => {
      alert('Payment successful! Welcome to our service.');
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  processPaypal(): void {
    console.log('Initiating PayPal payment...');
    this.processPayment();
  }
  private location = inject(Location); // Inject Location service

  goBack() {
    this.location.back(); // Navigates back in history
  }

}