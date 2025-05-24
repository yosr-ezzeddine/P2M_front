import { BackToDashboardComponent } from "../../admin-dashboard/back-to-dashboard/back-to-dashboard.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
interface Manager {
  id: number;
  name: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  departmentHead: number | null;
  parentDepartment: string | null;
  enableCollaboration: boolean;
  enable2FA: boolean;
}

@Component({
  selector: 'app-add-department',
  imports: [BackToDashboardComponent, NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  managers: Manager[] = [];
  departments: Department[] = [];
  showAdvancedOptions = false;

  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      description: [''],
      departmentHead: [null],
      parentDepartment: [null],
      enableCollaboration: [false],
      enable2FA: [false]
    });
  }

  ngOnInit(): void {
    // Simuler le chargement des managers et départements existants
    // Normalement, ces données viendraient d'un service
    this.loadManagers();
    this.loadDepartments();
  }

  loadManagers(): void {
    // Simuler des données - à remplacer par un appel API
    this.managers = [
      { id: 1, name: 'Jean Dupont' },
      { id: 2, name: 'Marie Martin' },
      { id: 3, name: 'Pierre Lambert' }
    ];
  }

  loadDepartments(): void {
    // Simuler des données - à remplacer par un appel API
    this.departments = [
      { id: 'IT', name: 'IT Department', description: 'Information Technology', departmentHead: 1, parentDepartment: null, enableCollaboration: true, enable2FA: true },
      { id: 'HR', name: 'Human Resources', description: 'HR Department', departmentHead: 2, parentDepartment: null, enableCollaboration: true, enable2FA: false },
      { id: 'FIN', name: 'Finance', description: 'Finance Department', departmentHead: 3, parentDepartment: null, enableCollaboration: false, enable2FA: true }
    ];
  }

  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  addNewManager(): void {
    // Ici vous pourriez ouvrir un dialogue pour ajouter un nouveau manager
    console.log('Adding new manager');
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      const newDepartment: Department = this.departmentForm.value;
      console.log('Nouveau département créé:', newDepartment);

      // Ici, vous appelleriez votre service pour sauvegarder le département
      // this.departmentService.addDepartment(newDepartment).subscribe(...);

      // Réinitialiser le formulaire après la soumission
      this.departmentForm.reset();
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.departmentForm.controls).forEach(key => {
        const control = this.departmentForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}