import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

declare var lucide: any;

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  navigateTo(action: string) {
    this.router.navigate([`/manage-employees/${action}`]);
  }

  ngAfterViewInit() {
    if (lucide) {
      lucide.createIcons();
    }
  }
}
