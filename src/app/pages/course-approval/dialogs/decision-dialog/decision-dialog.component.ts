import { Output, EventEmitter } from '@angular/core';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseApprovalService } from '../../services/course-approval.service';

@Component({
  selector: 'app-decision-dialog',
  templateUrl: './decision-dialog.component.html',
  styleUrls: ['./decision-dialog.component.scss']
})
export class DecisionDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public decisionForm!: FormGroup;
  public loggedInUser: any;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<DecisionDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    public _helper: HelperService,
    private _course: CourseApprovalService,
    private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    console.log(this.data)
    this.initCourseOutlineForm();
  }

  public initCourseOutlineForm() {
    this.decisionForm = this.fb.group({
      courseId: [this.data.editObject.courseId ? this.data.editObject.courseId : '', Validators.required],
      decisionType: [this.data.editObject.decisionType ? this.data.editObject.decisionType : '', Validators.required],
      comment: [this.data.editObject.comment ? this.data.editObject.comment : ''],
    })
  }

  public addDocument(event: any): void {
    let image = event;
    console.log(image); 
  }

  submit() {
    this._helper.startSpinner();
    const payload = this.decisionForm.value;
    let decision = this.decisionForm.get('decisionType')?.value;
    payload.courseId = parseInt(payload.courseId);
    console.log(payload);
    this.sub.add(
      this._course.ApproveCourse(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            if (this.data?.isEditing) {
              payload.courseId = payload?.courseId;
              payload.deleted = false;
            } else {
              payload.sectionId = res;
            }
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.close.nativeElement.click();
            this._helper.triggerSucessAlert(`You have successfully ${decision} a new course!!!`)
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
