import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalObjectivesComponent } from './appraisal-objectives.component';

describe('AppraisalObjectivesComponent', () => {
  let component: AppraisalObjectivesComponent;
  let fixture: ComponentFixture<AppraisalObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalObjectivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
