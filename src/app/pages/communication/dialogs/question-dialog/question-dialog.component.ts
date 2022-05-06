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
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { CourseCreationService } from 'app/pages/course-creation/services/course-creation.service';
import { Subscription } from 'rxjs';
import { ConversationType, QAType } from '../../models/communication.model';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})

export class QuestionDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public questionForm!: FormGroup;
  public isLoading: boolean =false;
  public loggedInUser: any;
  public createdBy!: number;
  public userId!: string;
  public loggedInId!: number;
  public courses: Courses[] = [];
  public isFetchingCourses:boolean = false;
  public course!: Courses;
  public courseId: any = 0;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    private _current: CurrentUserService,
    private _course: CourseCreationService,
    private _communication: CommunicationService,
    private _helper: HelperService,
  ) { }

  ngOnInit() {
    this.courseId = this.data.course;
    console.log(this.courseId)
    this.loggedInUser = this._current.getUser();
    this.userId = this.loggedInUser.userId;
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
      this.loggedInId = this.loggedInUser.trainingProviderId
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
      this.loggedInId = this.loggedInUser.trainingInstructorId
    }
    this.initQuestionForm();
    this.getAllCourses();
  }

  public getAllCourses(): void {
    const payload = {
      id: this.loggedInId,
      type: this.createdBy
    }
    this.isFetchingCourses = true;
    this.sub.add(
      this._course.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this.isFetchingCourses = false;
          this.courses = res['course_CreationSetupTypes'];
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public initQuestionForm() {
    this.questionForm = this.fb.group({
      courseQAId: [0],
      courseId: [this.courseId],
      parentId: [0],
      qaType: [QAType.Question],
      createdByType: [this.createdBy],
      createdBy: [this.userId],
      questionByName: [this.loggedInUser.full_Name],
      comment: ['', Validators.required],
      companyId: [+this.loggedInUser.companyId],
      conversationType: [ConversationType.QA],
    });
  }

  public changeQuestion() {
    this.courseId = this.course.courseId;
  }

  public submit() {
    this._helper.startSpinner();
    const payload = this.questionForm.value;
    payload.courseId = +this.courseId;
    console.log(payload)
    if(this.questionForm.valid) {
      console.log(payload);
      this.sub.add(
        this._communication.AddQuestionAndAnswer(payload).subscribe({
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

}


