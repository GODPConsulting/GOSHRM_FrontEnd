import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentLevelComponent } from './employment-level.component';

describe('EmploymentLevelComponent', () => {
  let component: EmploymentLevelComponent;
  let fixture: ComponentFixture<EmploymentLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
