import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkforcePlanComponent } from './workforce-plan.component';

describe('WorkforcePlanComponent', () => {
  let component: WorkforcePlanComponent;
  let fixture: ComponentFixture<WorkforcePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkforcePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkforcePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
