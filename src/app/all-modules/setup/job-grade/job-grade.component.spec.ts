import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobGradeComponent } from './job-grade.component';

describe('JobGradeComponent', () => {
  let component: JobGradeComponent;
  let fixture: ComponentFixture<JobGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
