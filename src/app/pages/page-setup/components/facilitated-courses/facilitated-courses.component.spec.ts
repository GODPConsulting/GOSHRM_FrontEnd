import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatedCoursesComponent } from './facilitated-courses.component';

describe('FacilitatedCoursesComponent', () => {
  let component: FacilitatedCoursesComponent;
  let fixture: ComponentFixture<FacilitatedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilitatedCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
