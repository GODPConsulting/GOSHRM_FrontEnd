import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  public addCourseForm!: FormGroup;
  public courseFormSubmitted: boolean = false;
  public loggedInUser: any;

  constructor(
    private fb: FormBuilder,
    private _currentService: CurrentUserService,
    private _courses: CourseCreationService,
    private _base: BaseComponent,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.initAddCourseForm();
  }

  initAddCourseForm() {
    this.addCourseForm = this.fb.group({
      training_Name: [''],
      training_Objective: [''],
      training_Requirements: [''],
      training_Transcript: [''],
      training_Details: [''],
      difficulty_Level: [''],
      expected_Competence: [''],
      category: [''],
      suggested_Participant: [''],
      delivery_Type: [''],
      duration: [''],
      cost: [''],
      facilitator: [''],
      discount_Rate: [''],
      currency: [''],
      welcome_message: [''],
      competence_assessment: [''],
      congratulation_message: [''],
      addCover_Image: [0],
      other_Comments: [''],
    })
  }

  public submit(): void {
    this.courseFormSubmitted = true;
    if (this.addCourseForm.valid) {
      this._helper.startSpinner();
      const payload = this.addCourseForm.value;
      payload.trainingProviderId = this.loggedInUser.trainingProviderId;
      payload.faciliator  = 1;
      let duration = this.addCourseForm.get('duration')?.value;
      payload.cost = parseInt(payload.cost);
      payload.duration = new Date (new Date().toDateString() + ' ' + duration);
      this._courses.UpdateCourse(payload).subscribe({
        next: (res: ResponseModel<Courses>) => {
         this._helper.stopSpinner();
          console.log(res)
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.courseFormSubmitted = false;
        },
      });
    }
  }

}
