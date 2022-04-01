
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseOutline, OutlineType, MediaType } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-course-section-dialog',
  templateUrl: './course-section-dialog.component.html',
  styleUrls: ['./course-section-dialog.component.scss']
})
export class CourseSectionDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public courseOutlineForm!: FormGroup;
  public loggedInUser: any;
  public outlineType = OutlineType;
  public mediaType = MediaType;
  public courseId: any;
  public documentUrl: any;
  
  @Output() event: EventEmitter<{
    editObject?: CourseOutline;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: CourseOutline; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<CourseOutline>,
    public fb: FormBuilder,
    public _helper: HelperService,
    private _course: CourseCreationService,
    private _current: CurrentUserService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    this.courseId = this.activateRoute.snapshot.paramMap.get('courseId');
    this.initCourseOutlineForm();
  }

  public initCourseOutlineForm() {
    this.courseOutlineForm = this.fb.group({
      companyId: [this.loggedInUser.companyId],
      number: [this.data.editObject.number ? this.data.editObject.number : '', Validators.required],
      section_Name: [this.data.editObject.section_Name ? this.data.editObject.section_Name : '', Validators.required],
      outline_Name: [this.data.editObject.outline_Name ? this.data.editObject.outline_Name : '', Validators.required],
      outline_Description: [this.data.editObject.outline_Description ? this.data.editObject.outline_Description : '', Validators.required],
      material_Name: [this.data.editObject.material_Name ? this.data.editObject.material_Name : ''],
      material_Type: [this.data.editObject.material_Type ? this.data.editObject.material_Type : 0],
      upload_Material: [this.data.editObject.upload_Material ? this.data.editObject.upload_Material : ''],
      type: [this.outlineType.Section],
      courseId: [this.data.editObject.courseId],
      outlineId: [this.data.editObject.outlineId],
      trainingProviderId: [this.loggedInUser.trainingProviderId],
      trainingInstructorId: [this.loggedInUser.trainingInstructorId],
    })
  }

  public getBase64(event: any) {
    // this.isUpload = !this.isUpload;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // console.log(reader.result);
      me.documentUrl = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  submit() {
    this._helper.startSpinner();
    const payload = this.courseOutlineForm.value;
    payload.outlineId = this.data.editObject.outlineId ? this.data.editObject.outlineId : 0;
    payload.sectionId = this.data?.editObject?.sectionId ? this.data?.editObject?.sectionId : 0 ;
    payload.courseId = parseInt(payload.courseId);
    payload.outlineId = parseInt(payload.outlineId);
    payload.material_Type = parseInt(payload.material_Type);
    payload.number = JSON.stringify(payload.number);
    if(this.documentUrl != null) {
      const imageUrl = this.documentUrl.split(",");;
      payload.material_Name = imageUrl[1];
    }
    console.log(payload);
    this.sub.add(
      this._course.UpdateCourseOutline(payload).subscribe({
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


