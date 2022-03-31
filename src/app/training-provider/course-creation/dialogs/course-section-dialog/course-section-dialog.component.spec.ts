import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSectionDialogComponent } from './course-section-dialog.component';

describe('CourseSectionDialogComponent', () => {
  let component: CourseSectionDialogComponent;
  let fixture: ComponentFixture<CourseSectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
