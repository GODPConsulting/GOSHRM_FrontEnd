import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkforceBudgetComponent } from './workforce-budget.component';

describe('WorkforceBudgetComponent', () => {
  let component: WorkforceBudgetComponent;
  let fixture: ComponentFixture<WorkforceBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkforceBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkforceBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
