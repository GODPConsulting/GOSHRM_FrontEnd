import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSchoolSubjectsComponent } from './high-school-subjects.component';

describe('HighSchoolSubjectsComponent', () => {
  let component: HighSchoolSubjectsComponent;
  let fixture: ComponentFixture<HighSchoolSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighSchoolSubjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighSchoolSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
