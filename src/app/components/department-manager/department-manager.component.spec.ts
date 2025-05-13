import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagerComponent } from './department-manager.component';

describe('DepartmentManagerComponent', () => {
  let component: DepartmentManagerComponent;
  let fixture: ComponentFixture<DepartmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
