import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentScoreDialogsComponent } from './assessment-score-dialogs.component';

describe('AssessmentScoreDialogsComponent', () => {
  let component: AssessmentScoreDialogsComponent;
  let fixture: ComponentFixture<AssessmentScoreDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentScoreDialogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentScoreDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
