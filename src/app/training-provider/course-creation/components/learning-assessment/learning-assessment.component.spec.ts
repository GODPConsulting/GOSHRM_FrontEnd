import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningAssessmentComponent } from './learning-assessment.component';

describe('LearningAssessmentComponent', () => {
  let component: LearningAssessmentComponent;
  let fixture: ComponentFixture<LearningAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
