import { Input,Component,HostListener, ElementRef } from '@angular/core';
import { EmployeeFormComponent } from "../../employee-form/employee-form.component";
import { DepartmentManagerComponent } from "../../department-manager/department-manager.component";
import { RolesPermissionsManagerComponent } from "../../roles-permissions-manager/roles-permissions-manager.component";
import { FileManagerComponent } from "../../file-manager/file-manager.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dynamic-content',
  imports: [NgIf,EmployeeFormComponent, DepartmentManagerComponent, RolesPermissionsManagerComponent, FileManagerComponent],
  templateUrl: './dynamic-content.component.html',
  styleUrl: './dynamic-content.component.scss'
})
export class DynamicContentComponent {
  @Input() selectedAction: string | null = null;  // Recevoir l'action sélectionnée du parent

 

}
