import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalObjectiveFormComponent } from './appraisal-objective-form.component';

describe('AppraisalObjectiveFormComponent', () => {
  let component: AppraisalObjectiveFormComponent;
  let fixture: ComponentFixture<AppraisalObjectiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalObjectiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalObjectiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
