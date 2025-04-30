import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  imports: [NavbarComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PricingComponent implements AfterViewInit {
  // Données des plans centralisées
  plansData = {
    personal: {
      monthlyPrice: 35,
      yearlyPrice: 28,
      features: [
        '✔ 50GB Storage',
        '✔ 7-day free trial',
        '✖ Smart analytics'
      ],
      compare: {
        storage: '50 GB',
        users: '1',
        collaborators: '5'
      }
    },
    startup: {
      monthlyPrice: 150,
      yearlyPrice: 130,
      features: [
        '✔ Up to 50 users',
        '✔ Collaboration features',
        '✔ Smart analytics',
        '✔ 30-day free trial'
      ],
      compare: {
        storage: '2 TB',
        users: '50',
        collaborators: '50'
      }
    },
    enterprise: {
      monthlyPrice: 300,
      yearlyPrice: 250,
      features: [
        '✔ Unlimited users',
        '✔ Collaboration features',
        '✔ Smart analytics',
        '✔ 30-day free trial'
      ],
      compare: {
        storage: 'Unlimited',
        users: 'Unlimited',
        collaborators: 'Unlimited'
      }
    }
  };

  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    this.initPricingToggle();
  }

  private initPricingToggle(): void {
    const monthlyBtn = document.getElementById('monthly');
    const yearlyBtn = document.getElementById('yearly');
    const amounts = document.querySelectorAll<HTMLElement>('.amount');

    const updatePricing = (mode: 'monthly' | 'yearly') => {
      amounts.forEach(el => {
        const planId = this.getPlanIdFromElement(el);
        const price = this.plansData[planId][`${mode}Price`];
        el.textContent = `$${price}`;
      });

      if (mode === 'monthly') {
        monthlyBtn?.classList.add('active');
        yearlyBtn?.classList.remove('active');
      } else if (mode === 'yearly') {
        yearlyBtn?.classList.add('active');
        monthlyBtn?.classList.add('inactive');

      }
    };

    monthlyBtn?.addEventListener('click', () => updatePricing('monthly'));
    yearlyBtn?.addEventListener('click', () => updatePricing('yearly'));

  }

  private getPlanIdFromElement(el: Element): keyof typeof this.plansData {
    const parentPlan = el.closest('.plan');
    if (parentPlan?.classList.contains('personal')) return 'personal';
    if (parentPlan?.classList.contains('startup')) return 'startup';
    return 'enterprise';
  }

  navigateToPayment(planId: string): void {
    this.router.navigate(['/sign-up'], {
      state: {
        plan: planId,
        planData: this.plansData[planId as keyof typeof this.plansData]
      }
    });
  }
}