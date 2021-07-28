import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackKudosComponent } from './feedback-kudos.component';

describe('FeedbackKudosComponent', () => {
  let component: FeedbackKudosComponent;
  let fixture: ComponentFixture<FeedbackKudosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackKudosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackKudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
