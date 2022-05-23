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
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-competence-assessment-dialog',
  templateUrl: './competence-assessment-dialog.component.html',
  styleUrls: ['./competence-assessment-dialog.component.scss']
})

export class CompetenceAssessmentDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public reviewerForm!: FormGroup;
  public ratingForm!: FormGroup;
  public isLoading: boolean = false;
  public courseId: any;
  public reviewers: string[] = [];
  public addReviewers = (email: any) => (email);
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    private _helper: HelperService,
    private _course: CourseCreationService,
  ) { }

  ngOnInit() {
    this.initRatingForm();
  }

  public initRatingForm() {
    this.ratingForm = this.fb.group({
      companyId: [this.data?.editObject?.companyId],
      courseId: [this.data?.editObject?.courseId],
      competenceId: [this.data?.editObject?.competenceId],
      competence: [this.data?.editObject?.competence],
      rating: [0, Validators.required],
    })
  }

  public submit() {
    this._helper.startSpinner();
    const reviewwerForm = {
      reviewers: this.reviewers,
      courseId: +this.data.course
    }
    let payload = this.data.isEditing ? this.ratingForm.value : reviewwerForm;
    payload.rating = +payload.rating;
    const operation = this.data.isEditing ? 'addUpdateCompetence' : 'addCompetenceReviewer';
    console.log(payload);
    this.sub.add(
      this._course[operation](payload).subscribe({
        next: (res: any) => {
          console.log(res);
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            if (this.data?.isEditing) {
              payload.competenceId = payload?.competenceId;
              payload.deleted = false;
            } else {
              // payload.competenceId = res;
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
