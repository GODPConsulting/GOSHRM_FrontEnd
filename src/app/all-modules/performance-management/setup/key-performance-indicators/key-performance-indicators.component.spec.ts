import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyPerformanceIndicatorsComponent } from './key-performance-indicators.component';

describe('KeyPerformanceIndicatorsComponent', () => {
  let component: KeyPerformanceIndicatorsComponent;
  let fixture: ComponentFixture<KeyPerformanceIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyPerformanceIndicatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyPerformanceIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
