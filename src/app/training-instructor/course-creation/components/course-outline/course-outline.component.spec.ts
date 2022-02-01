import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOutlineComponent } from './course-outline.component';

describe('CourseOutlineComponent', () => {
  let component: CourseOutlineComponent;
  let fixture: ComponentFixture<CourseOutlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseOutlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
