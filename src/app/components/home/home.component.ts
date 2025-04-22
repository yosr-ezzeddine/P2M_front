import { Component } from '@angular/core';
import { FloatingCloudsComponent } from "../floating-clouds/floating-clouds.component";
import { AnimatedbuttonComponent } from "../animatedbutton/animatedbutton.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HomeCoreComponent } from "../home-core/home-core.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [FloatingCloudsComponent, AnimatedbuttonComponent, NavbarComponent, HomeCoreComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {

}
