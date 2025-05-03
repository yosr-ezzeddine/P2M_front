import { Component } from '@angular/core';
import { BackToDashboardComponent } from "../../admin-dashboard/back-to-dashboard/back-to-dashboard.component";

@Component({
  selector: 'app-list-employees',
  standalone:true,
  imports: [BackToDashboardComponent],
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.css'
})
export class ListEmployeesComponent {

}
