import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceAssessmentDialogComponent } from './competence-assessment-dialog.component';

describe('CompetenceAssessmentDialogComponent', () => {
  let component: CompetenceAssessmentDialogComponent;
  let fixture: ComponentFixture<CompetenceAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetenceAssessmentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetenceAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
