import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDataComponent } from './payroll-data.component';

describe('PayrollDataComponent', () => {
  let component: PayrollDataComponent;
  let fixture: ComponentFixture<PayrollDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
