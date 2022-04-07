import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseAssessmentComponent } from './create-course-assessment.component';

describe('CreateCourseAssessmentComponent', () => {
  let component: CreateCourseAssessmentComponent;
  let fixture: ComponentFixture<CreateCourseAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCourseAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
