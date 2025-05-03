import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AddEmployeeComponent } from './components/employee-form/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employee-form/edit-employee/edit-employee.component';
import { ListEmployeesComponent } from './components/employee-form/list-employees/list-employees.component';
import { DeleteEmployeeComponent } from './components/employee-form/delete-employee/delete-employee.component';
import { ListDepartmentsComponent } from './components/department-manager/list-departments/list-departments.component';
import { AddDepartmentComponent } from './components/department-manager/add-department/add-department.component';
import { EditDepartmentComponent } from './components/department-manager/edit-department/edit-department.component';
import { DeleteDepartmentComponent } from './components/department-manager/delete-department/delete-department.component';

export const routes: Routes = [
    {path:"home", component:HomeComponent},
    {path:"pricing", component:PricingComponent},
    { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'manage-employees/add', component: AddEmployeeComponent },
  { path: 'manage-employees/edit', component: EditEmployeeComponent },
  { path: 'manage-employees/remove', component:DeleteEmployeeComponent},
  { path: 'manage-employees/list', component:ListEmployeesComponent },
  { path: 'manage-departments/add-department', component: AddDepartmentComponent },
  { path: 'manage-departments/edit-department', component: EditDepartmentComponent },
  { path: 'manage-departments/list-department', component:ListDepartmentsComponent },
  { path: 'manage-departments/remove-department', component:DeleteDepartmentComponent},
  { path: '**', component: NotfoundComponent },
  {path:"", redirectTo: 'home', pathMatch:'full'},

];
