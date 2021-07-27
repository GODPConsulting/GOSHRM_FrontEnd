import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreesixtyAppraisalComponent } from './threesixty-appraisal.component';

describe('ThreesixtyAppraisalComponent', () => {
  let component: ThreesixtyAppraisalComponent;
  let fixture: ComponentFixture<ThreesixtyAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreesixtyAppraisalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreesixtyAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
