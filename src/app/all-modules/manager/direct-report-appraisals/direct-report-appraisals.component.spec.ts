import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectReportAppraisalsComponent } from './direct-report-appraisals.component';

describe('DirectReportAppraisalsComponent', () => {
  let component: DirectReportAppraisalsComponent;
  let fixture: ComponentFixture<DirectReportAppraisalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectReportAppraisalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectReportAppraisalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
