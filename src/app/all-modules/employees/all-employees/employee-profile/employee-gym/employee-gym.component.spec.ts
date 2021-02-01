import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGymComponent } from './employee-gym.component';

describe('EmployeeGymComponent', () => {
  let component: EmployeeGymComponent;
  let fixture: ComponentFixture<EmployeeGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeGymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
