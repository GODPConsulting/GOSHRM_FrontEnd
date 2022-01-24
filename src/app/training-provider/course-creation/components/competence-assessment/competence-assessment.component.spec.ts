import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceAssessmentComponent } from './competence-assessment.component';

describe('CompetenceAssessmentComponent', () => {
  let component: CompetenceAssessmentComponent;
  let fixture: ComponentFixture<CompetenceAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetenceAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetenceAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
