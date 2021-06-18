import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAppraisalsComponent } from './employee-appraisals.component';

describe('EmployeeAppraisalsComponent', () => {
  let component: EmployeeAppraisalsComponent;
  let fixture: ComponentFixture<EmployeeAppraisalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAppraisalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAppraisalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
