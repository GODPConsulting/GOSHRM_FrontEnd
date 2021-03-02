import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalObjectiveViewComponent } from './appraisal-objective-view.component';

describe('AppraisalObjectiveViewComponent', () => {
  let component: AppraisalObjectiveViewComponent;
  let fixture: ComponentFixture<AppraisalObjectiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalObjectiveViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalObjectiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
