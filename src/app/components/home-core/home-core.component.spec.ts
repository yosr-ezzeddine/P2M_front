import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCoreComponent } from './home-core.component';

describe('HomeCoreComponent', () => {
  let component: HomeCoreComponent;
  let fixture: ComponentFixture<HomeCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
