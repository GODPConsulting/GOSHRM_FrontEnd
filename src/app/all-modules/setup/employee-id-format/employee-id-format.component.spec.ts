import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIdFormatComponent } from './employee-id-format.component';

describe('EmployeeIdFormatComponent', () => {
  let component: EmployeeIdFormatComponent;
  let fixture: ComponentFixture<EmployeeIdFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeIdFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIdFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
