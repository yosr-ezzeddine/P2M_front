import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedbuttonComponent } from './animatedbutton.component';

describe('AnimatedbuttonComponent', () => {
  let component: AnimatedbuttonComponent;
  let fixture: ComponentFixture<AnimatedbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
