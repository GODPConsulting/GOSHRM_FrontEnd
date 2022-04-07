import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLearningAssessmentComponent } from './create-learning-assessment.component';

describe('CreateLearningAssessmentComponent', () => {
  let component: CreateLearningAssessmentComponent;
  let fixture: ComponentFixture<CreateLearningAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLearningAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLearningAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
