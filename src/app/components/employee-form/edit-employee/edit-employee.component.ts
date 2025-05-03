import { Component } from '@angular/core';
import { BackToDashboardComponent } from "../../admin-dashboard/back-to-dashboard/back-to-dashboard.component";

@Component({
  selector: 'app-edit-employee',
  standalone:true,
  imports: [BackToDashboardComponent],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent {

}
