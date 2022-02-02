
import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseOutline } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-course-outline-dialog',
  templateUrl: './course-outline-dialog.component.html',
  styleUrls: ['./course-outline-dialog.component.scss']
})

export class CourseOutlineDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public courseOutlineForm!: FormGroup;
  public loggedInUser: any;
  
  @Output() event: EventEmitter<{
    editObject?: CourseOutline;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: CourseOutline; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<CourseOutlineDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<CourseOutline>,
    public fb: FormBuilder,
    public _helper: HelperService,
    private _course: CourseCreationService,
    private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    this.initCourseOutlineForm();
  }

  public initCourseOutlineForm() {
    this.courseOutlineForm = this.fb.group({
      section_Name: ['', Validators.required],
      outline_Name: ['', Validators.required],
      outline_Description: ['', Validators.required],
      sectionId: ['', Validators.required],
    })
  }

  submit() {
    this._helper.startSpinner();
    const payload = this.courseOutlineForm.value;
    payload.trainingProviderId = this.loggedInUser?.trainingProviderId;
    payload.trainingInstructorId = this.loggedInUser?.trainingInstructorId;
    payload.sectionId = this.data?.editObject?.sectionId ? this.data?.editObject?.sectionId : 0 ;
    console.log(payload);
    this.sub.add(
      this._course.UpdateCourseOutline(payload, payload.trainingProviderId).subscribe({
        next: (res: any) => {
          console.log(res);
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            if (this.data?.isEditing) {
              payload.sectionId = payload?.sectionId;
              payload.deleted = false;
            } else {
              payload.sectionId = res;
            }
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.close.nativeElement.click();
            this._helper.triggerSucessAlert('Course outline created successfully!!!')
          } else {
            this._helper.stopSpinner();
            this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
          }
        },
        error: (error: any) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

}

