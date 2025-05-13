import { Component } from '@angular/core';
import { BackToDashboardComponent } from "../../admin-dashboard/back-to-dashboard/back-to-dashboard.component";

@Component({
  selector: 'app-delete-employee',
  standalone:true,
  imports: [BackToDashboardComponent],
  templateUrl: './delete-employee.component.html',
  styleUrl: './delete-employee.component.css'
})
export class DeleteEmployeeComponent {

}
