import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAdjustmentComponent } from './payroll-adjustment.component';

describe('PayrollAdjustmentComponent', () => {
  let component: PayrollAdjustmentComponent;
  let fixture: ComponentFixture<PayrollAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
