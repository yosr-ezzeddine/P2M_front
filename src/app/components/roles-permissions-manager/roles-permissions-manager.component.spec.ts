import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionsManagerComponent } from './roles-permissions-manager.component';

describe('RolesPermissionsManagerComponent', () => {
  let component: RolesPermissionsManagerComponent;
  let fixture: ComponentFixture<RolesPermissionsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPermissionsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermissionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
