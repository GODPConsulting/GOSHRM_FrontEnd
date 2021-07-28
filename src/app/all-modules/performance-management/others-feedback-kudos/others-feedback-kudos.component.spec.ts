import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersFeedbackKudosComponent } from './others-feedback-kudos.component';

describe('OthersFeedbackKudosComponent', () => {
  let component: OthersFeedbackKudosComponent;
  let fixture: ComponentFixture<OthersFeedbackKudosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersFeedbackKudosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersFeedbackKudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
