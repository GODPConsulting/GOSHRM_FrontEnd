import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalPreferenceComponent } from './appraisal-preference.component';

describe('AppraisalPreferenceComponent', () => {
  let component: AppraisalPreferenceComponent;
  let fixture: ComponentFixture<AppraisalPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
