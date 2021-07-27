import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreesixtyAppraisalsComponent } from './threesixty-appraisals.component';

describe('ThreesixtyAppraisalsComponent', () => {
  let component: ThreesixtyAppraisalsComponent;
  let fixture: ComponentFixture<ThreesixtyAppraisalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreesixtyAppraisalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreesixtyAppraisalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
