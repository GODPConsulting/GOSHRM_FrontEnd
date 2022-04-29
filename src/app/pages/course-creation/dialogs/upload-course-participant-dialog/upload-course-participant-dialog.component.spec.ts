import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCourseParticipantDialogComponent } from './upload-course-participant-dialog.component';

describe('UploadCourseParticipantDialogComponent', () => {
  let component: UploadCourseParticipantDialogComponent;
  let fixture: ComponentFixture<UploadCourseParticipantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCourseParticipantDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCourseParticipantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
