import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Currency } from '@core/models/currencies.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';
import { DatePipe } from '@angular/common'

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
  public instructors: Currency[]= [];
  public instructorId: any;
  public courseId: any = 0;
  public course!: Courses;
  public beginDate: any = new Date('2008-09-19 07:14:00');
  public endDate: any = new Date('2008-09-19 17:35:00');

  public sp: any;
  // alert("timeuse：" + sp.hour + " hour " + sp.minute + " minute " + sp.second + " second ");

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
    private _route:ActivatedRoute,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    // this.sp = this.getTimeSpan(this.endDate - this.beginDate);
    // console.log(this.sp)
    this.loggedInUser = this._currentService.getUser();
    if (this._route.snapshot.paramMap.get('instructorId')) {
      this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    }
    if (this._route.snapshot.paramMap.get('courseId')) {
      this.courseId = this._route.snapshot.paramMap.get('courseId');
    }
    this.getResolvedData();
    this.getOneCourses();
    this.initAddCourseForm();
  }

  public getOneCourses(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._courses.getOneCoursesById(this.courseId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.course = res['course_CreationSetupTypes'];
          // console.log(this.course)
          this.initAddCourseForm();
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        // console.log(data);
        this.currencies = data?.resolveData?.currency?.commonLookups;
        this.instructors = data?.resolveData?.instructors?.training_InstructorSetupTypes;
      })
    );
  }

  initAddCourseForm() {
    this.addCourseForm = this.fb.group({
      training_Name: [this.course?.training_Name ? this.course?.training_Name : '', Validators.required],
      training_Objective: [this.course?.training_Objective? this.course?.training_Objective :''],
      training_Requirements: [this.course?.training_Requirements ? this.course?.training_Requirements : ''],
      training_Transcript: [this.course?.training_Transcript ? this.course?.training_Transcript : ''],
      training_Details: [this.course?.training_Details ? this.course?.training_Details : ''],
      difficulty_Level: [this.course?.difficulty_Level ? this.course?.difficulty_Level :''],
      expected_Competence: [this.course?.expected_Competence ? this.course?.expected_Competence : ''],
      category: [this.course?.category ? this.course?.category : ''],
      suggested_Participant: [this.course?.suggested_Participant ? this.course?.suggested_Participant : ''],
      delivery_Type: [this.course?.delivery_Type ? this.course?.delivery_Type : ''],
      duration: [this.course?.duration ? this.course?.duration : ''],
      cost: [this.course?.cost ? this.course?.cost : 0],
      facilitator: [this.course?.facilitator ? this.course?.facilitator : ''],
      discount_Rate: [this.course?.discount_Rate ? this.course?.discount_Rate : ''],
      currencyId: [this.course?.currencyId ? this.course?.currencyId : 0],
      welcome_message: [this.course?.welcome_message ? this.course?.welcome_message : ''],
      competence_assessment: [this.course?.completence_Assessment ? this.course?.completence_Assessment : ''],
      congratulation_message: [this.course?.congratulation_message ? this.course?.congratulation_message : ''],
      addCover_Image: [this.course?.addCover_Image ? this.course?.addCover_Image : ''],
      other_Comments: [this.course?.other_Comments ? this.course?.other_Comments : ''],
    })
  }

  public addDocument(event: any): void {
    let image = event;
    console.log(image);
    
  }

 stringToDate(string: any) {
        var matches;
    if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2}) (\d{2,2}):(\d{2,2}):(\d{2,2})$/)) {
       return new Date(matches[1], matches[2] - 1, matches[3], matches[4], matches[5], matches[6]);
    } else {
       return null;
    };
}

getTimeSpan(ticks: any ) {
        var d = new Date(ticks);
        return {
            hour: d.getUTCHours(), 
            minute: d.getMinutes(), 
            second: d.getSeconds()
        }
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
      let new_duration = new Date (new Date().toDateString() + ' ' + duration);
      // payload.duration = this.sp;
      payload.duration =this.datepipe.transform(new_duration, 'h:mm:ss');
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
