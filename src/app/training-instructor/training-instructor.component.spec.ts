import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingInstructorComponent } from './training-instructor.component';

describe('TrainingInstructorComponent', () => {
  let component: TrainingInstructorComponent;
  let fixture: ComponentFixture<TrainingInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingInstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
