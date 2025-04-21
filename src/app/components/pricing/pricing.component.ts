import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-pricing',
  imports: [NavbarComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PricingComponent {

}
