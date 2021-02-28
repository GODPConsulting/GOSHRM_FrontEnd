import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalCyclePageComponent } from './appraisal-cycle-page.component';

describe('AppraisalCyclePageComponent', () => {
  let component: AppraisalCyclePageComponent;
  let fixture: ComponentFixture<AppraisalCyclePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalCyclePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalCyclePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
