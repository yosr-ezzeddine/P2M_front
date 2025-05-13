import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-to-dashboard',
  standalone:true,
  imports: [],
  templateUrl: './back-to-dashboard.component.html',
  styleUrl: './back-to-dashboard.component.scss'
})
export class BackToDashboardComponent {
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/admin-dashboard']);  // Navigate to the Admin Dashboard route 

  }
}
