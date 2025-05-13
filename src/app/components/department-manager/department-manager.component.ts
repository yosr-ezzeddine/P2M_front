import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
declare var lucide: any;

@Component({
  selector: 'app-department-manager',
  standalone: true,
  imports: [],
  templateUrl: './department-manager.component.html',
  styleUrl: './department-manager.component.scss'
})
export class DepartmentManagerComponent {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  navigateTo(action: string) {
    this.router.navigate([`/manage-departments/${action}`]);
  }

  ngAfterViewInit() {
    if (lucide) {
      lucide.createIcons();
    }
  }

}
