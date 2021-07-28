import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFeedbackKudosComponent } from './my-feedback-kudos.component';

describe('MyFeedbackKudosComponent', () => {
  let component: MyFeedbackKudosComponent;
  let fixture: ComponentFixture<MyFeedbackKudosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFeedbackKudosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFeedbackKudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
