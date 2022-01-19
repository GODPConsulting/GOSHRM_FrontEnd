import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorFacilitatorSetupComponent } from './instructor-facilitator-setup.component';

describe('InstructorFacilitatorSetupComponent', () => {
  let component: InstructorFacilitatorSetupComponent;
  let fixture: ComponentFixture<InstructorFacilitatorSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorFacilitatorSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorFacilitatorSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
