import { Component, ElementRef, HostListener, AfterViewInit } from '@angular/core'; 
import { DynamicContentComponent } from './dynamic-content/dynamic-content.component';

declare var lucide: any;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DynamicContentComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {
  selectedAction: string | null = null;

  constructor(private elementRef: ElementRef) {}

  selectAction(action: string) {
    this.selectedAction = action;
    console.log('Action selected:', action);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    console.log('Document clicked:', event);

    const clickedInsideDashboard = this.elementRef.nativeElement.contains(event.target);

    const dynamicContentElement = document.querySelector('app-dynamic-content');
    const clickedInsideDynamicContent = dynamicContentElement?.contains(event.target as Node);

    console.log('Clicked inside admin-dashboard:', clickedInsideDashboard);
    console.log('Clicked inside dynamic-content:', clickedInsideDynamicContent);

    if (!clickedInsideDashboard && !clickedInsideDynamicContent) {
      console.log('Click detected outside both components. Hiding dynamic content.');
      this.selectedAction = '';  // Hide dynamic content
    }
  }

  ngAfterViewInit(): void {
    if (lucide) {
      lucide.createIcons();
    }
  }
}
