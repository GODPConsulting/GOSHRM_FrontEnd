import { Output, EventEmitter } from '@angular/core';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
// import { CourseApprovalService } from '../../services/course-approval.service';

@Component({
  selector: 'app-decision-dialog',
  templateUrl: './decision-dialog.component.html',
  styleUrls: ['./decision-dialog.component.scss']
})
export class DecisionDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public courseOutlineForm!: FormGroup;
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
    // private _course: CourseApprovalService,
    private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    console.log(this.data)
    this.initCourseOutlineForm();
  }

  public initCourseOutlineForm() {
    this.courseOutlineForm = this.fb.group({
      decision: [this.data.editObject.section_Number ? this.data.editObject.section_Number : '', Validators.required],
      comment: [this.data.editObject.section_Name ? this.data.editObject.section_Name : '', Validators.required],
    })
  }

  public addDocument(event: any): void {
    let image = event;
    console.log(image); 
  }

  submit() {
    this._helper.startSpinner();
    const payload = this.courseOutlineForm.value;
    payload.trainingProviderId = this.loggedInUser?.trainingProviderId;
    payload.trainingInstructorId = this.loggedInUser?.trainingInstructorId;
    payload.sectionId = this.data?.editObject?.sectionId ? this.data?.editObject?.sectionId : 0 ;
    // payload.courseId = this.data?.editObject?.courseId;
    this.data.isEditing ? payload.courseId = this.data.editObject.courseId : payload.courseId = this.data.editObject
    payload.courseId = parseInt(payload.courseId);
    console.log(payload);
    // this.sub.add(
    //   this._course.UpdateCourseOutline(payload, payload.trainingProviderId).subscribe({
    //     next: (res: any) => {
    //       console.log(res);
    //       if(res.status.isSuccessful) {
    //         this._helper.stopSpinner();
    //         if (this.data?.isEditing) {
    //           payload.sectionId = payload?.sectionId;
    //           payload.deleted = false;
    //         } else {
    //           payload.sectionId = res;
    //         }
    //         this.event.emit({
    //           isEditing: this.data?.isEditing,
    //           editObject: payload,
    //         });
    //         this.close.nativeElement.click();
    //         this._helper.triggerSucessAlert('Course outline created successfully!!!')
    //       } else {
    //         this._helper.stopSpinner();
    //         this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
    //       }
    //     },
    //     error: (error: any) => {
    //       this._helper.stopSpinner();
    //       console.log(error);
    //     },
    //   })
    // );
  }

}
