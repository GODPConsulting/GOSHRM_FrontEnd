import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalFeedbackPageComponent } from './appraisal-feedback-page.component';

describe('AppraisalFeedbackPageComponent', () => {
  let component: AppraisalFeedbackPageComponent;
  let fixture: ComponentFixture<AppraisalFeedbackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalFeedbackPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalFeedbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
