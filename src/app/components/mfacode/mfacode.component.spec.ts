import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFACodeComponent } from './mfacode.component';

describe('MFACodeComponent', () => {
  let component: MFACodeComponent;
  let fixture: ComponentFixture<MFACodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MFACodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MFACodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
