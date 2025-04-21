import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingCloudsComponent } from './floating-clouds.component';

describe('FloatingCloudsComponent', () => {
  let component: FloatingCloudsComponent;
  let fixture: ComponentFixture<FloatingCloudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingCloudsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
