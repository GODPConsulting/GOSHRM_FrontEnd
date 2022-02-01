import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOutlineDialogComponent } from './course-outline-dialog.component';

describe('CourseOutlineDialogComponent', () => {
  let component: CourseOutlineDialogComponent;
  let fixture: ComponentFixture<CourseOutlineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseOutlineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseOutlineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
