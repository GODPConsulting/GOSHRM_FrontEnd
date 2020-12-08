import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSchoolGradeComponent } from './high-school-grade.component';

describe('HighSchoolGradeComponent', () => {
  let component: HighSchoolGradeComponent;
  let fixture: ComponentFixture<HighSchoolGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighSchoolGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighSchoolGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
