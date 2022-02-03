import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Currency } from '@core/models/currencies.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public addCourseForm!: FormGroup;
  public courseFormSubmitted: boolean = false;
  public loggedInUser: any;
  public file: any;
  public currencies: Currency[]= [];
  public instructorId: any;
  public participant: any[] = [
    {id: 1, name: 'Muhydeen Alabi'},
    {id: 2, name: 'Etim Essang'},
    {id: 3, name: 'Dayo Tella'},
  ];
  public requirement: any[] = [
    {id: 1, name: 'Laptop'},
    {id: 2, name: 'Internet'},
    {id: 3, name: 'Notepad'},
  ];

  constructor(
    private fb: FormBuilder,
    private _currentService: CurrentUserService,
    private _courses: CourseCreationService,
    private _helper: HelperService,
    private activateRoute: ActivatedRoute,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    if (this._route.snapshot.paramMap.get('instructorId')) {
      this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    }
    this.getResolvedData();
    this.initAddCourseForm();
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        // console.log(data);
        this.currencies = data?.resolveData?.currency?.commonLookups;
      })
    );
  }

  initAddCourseForm() {
    this.addCourseForm = this.fb.group({
      training_Name: ['', Validators.required],
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
      currencyId: [''],
      welcome_message: [''],
      competence_assessment: [''],
      congratulation_message: [''],
      addCover_Image: [''],
      other_Comments: [''],
    })
  }

  public addDocument(event: any): void {
    let image = event;
    console.log(image);
    
  }

  public submit(): void {
    this.courseFormSubmitted = true;
    if (this.addCourseForm.valid) {
      this._helper.startSpinner();
      const payload = this.addCourseForm.value;
      payload.trainingProviderId = this.loggedInUser.trainingProviderId;
      payload.faciliator  = 1;
      payload.suggested_Participant  = 'Muhydeen Alabi';
      payload.addCover_Image  = 0;
      let duration = this.addCourseForm.get('duration')?.value;
      payload.cost = parseInt(payload.cost);
      payload.duration = new Date (new Date().toDateString() + ' ' + duration);
      this._courses.UpdateCourse(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.addCourseForm.reset();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
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
