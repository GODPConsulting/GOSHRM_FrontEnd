import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSchoolSubjectComponent } from './high-school-subject.component';

describe('HighSchoolSubjectComponent', () => {
  let component: HighSchoolSubjectComponent;
  let fixture: ComponentFixture<HighSchoolSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighSchoolSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighSchoolSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
