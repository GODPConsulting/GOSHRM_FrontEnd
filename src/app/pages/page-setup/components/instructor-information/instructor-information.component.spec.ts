import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorInformationComponent } from './instructor-information.component';

describe('InstructorInformationComponent', () => {
  let component: InstructorInformationComponent;
  let fixture: ComponentFixture<InstructorInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
