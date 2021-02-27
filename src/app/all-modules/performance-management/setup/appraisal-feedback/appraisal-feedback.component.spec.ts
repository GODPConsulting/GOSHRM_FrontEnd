import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalFeedbackComponent } from './appraisal-feedback.component';

describe('AppraisalFeedbackComponent', () => {
  let component: AppraisalFeedbackComponent;
  let fixture: ComponentFixture<AppraisalFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
