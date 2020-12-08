import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicGradeComponent } from './academic-grade.component';

describe('AcademicGradeComponent', () => {
  let component: AcademicGradeComponent;
  let fixture: ComponentFixture<AcademicGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
