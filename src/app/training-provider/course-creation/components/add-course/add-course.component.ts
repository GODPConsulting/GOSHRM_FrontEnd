import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from '@core/models/currencies.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';
import { DatePipe } from '@angular/common'
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CreatedByType } from '@core/models/creation-type.model';

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
  public htmlContent = ``;
  public createdBy = CreatedByType;
  public newRequirement = (requirement: any) => ({ name: requirement });
  public newParticipant = (participant: any) => ({ name: participant });
  public newCompetence = (competence: any) => ({ name: competence });
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    // height: '2rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  // alert("timeuse：" + sp.hour + " hour " + sp.minute + " minute " + sp.second + " second ");

  public requirement: any[] = [
    { name: 'Laptop'},
    { name: 'Internet'},
    { name: 'Notepad'},
  ];
  public competencies: any[] = [
    { name: 'Good'},
    { name: 'very Good'},
    { name: 'Excellent'},
  ];
  public industries: any[] = [
    {name: 'Energy'},
    {name: 'Materials'},
    {name: 'Industrials'},
    {name: 'Consumer Discretionary'},
    {name: 'Consumer Staples'},
    {name: 'Health Care'},
    {name: 'Financials'},
    {name: 'Information Technology'},
    {name: 'Communication Services'},
    {name: 'Utilities'},
    {name: 'Real Estate'},
  ];

  constructor(
    private fb: FormBuilder,
    private _currentService: CurrentUserService,
    private _courses: CourseCreationService,
    private _helper: HelperService,
    private activateRoute: ActivatedRoute,
    private _route:ActivatedRoute,
    public datepipe: DatePipe,
    private _router: Router
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
      this.getOneCourses();
    }
    this.getResolvedData();
    this.initAddCourseForm();
  }

  public getOneCourses(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._courses.getOneCoursesById(this.courseId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.course = res['course_CreationSetupTypes'][0];
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
      courseId: [this.courseId],
      createdByType: [this.createdBy.provider],
      providerId: [this.loggedInUser.trainingProviderId],
      companyId: [this.loggedInUser.companyId],
      decisionType: [this.course?.decisionType ? this.course?.decisionType : ''],
      training_Name: [this.course?.training_Name ? this.course?.training_Name : '', Validators.required],
      training_Objective: [this.course?.training_Objective? this.course?.training_Objective :''],
      course_Requirement: [[]],
      training_Transcript: [this.course?.training_Transcript ? this.course?.training_Transcript : ''],
      training_Details: [this.course?.training_Details ? this.course?.training_Details : ''],
      difficulty_Level: [this.course?.difficulty_Level ? this.course?.difficulty_Level :''],
      course_Competence: [[]],
      category: [this.course?.category ? this.course?.category : ''],
      course_sector: [[]],
      delivery_Type: [this.course?.delivery_Type ? this.course?.delivery_Type : ''],
      duration: [this.course?.duration ? this.course?.duration : ''],
      cost: [this.course?.cost ? this.course?.cost : 0],
      facilitator: [[]],
      apply_Discount: [this.course?.apply_Discount ? this.course?.apply_Discount : false],
      discount_Rate: [this.course?.discount_Rate ? this.course?.discount_Rate : 0],
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

  public checkForKeyEnter(event: any): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
    }
  }
   

  public submit(): void {
    this.courseFormSubmitted = true;
    console.log(this.addCourseForm.value);
    if (this.addCourseForm.valid) {
      this._helper.startSpinner();
      const payload = this.addCourseForm.value;
      payload.addCover_Image  = 0;
      let duration = this.addCourseForm.get('duration')?.value;
      payload.cost = parseInt(payload.cost);
      let new_duration = new Date (new Date().toDateString() + ' ' + duration);
      // payload.duration = this.sp;
      payload.duration = this.datepipe.transform(new_duration, 'h:mm:ss');
      let expected_Competence = [];
      let facilitators = [];
      let course_sectors = [];
      let course_Requirements = [];
      let competence = payload.course_Competence.map((m: any) => {
        return {
          course_CompeteneceId: 0,
          courseId: this.courseId,
          name: m
        }
      })
      expected_Competence.push(competence);
      let course_sector = payload.course_sector.map((m: any) => {
        return {
          course_SectorId: 0,
          courseId: this.courseId,
          sectorName: m
        }
      })
      course_sectors.push(course_sector);
      let facilitator = payload.facilitator.map((m: any) => {
        return {
          course_FacilitatorId: 0,
          courseId: this.courseId,
          instructorId: m
        }
      })
      facilitators.push(facilitator);
      let course_Requirement = payload.course_Requirement.map((m: any) => {
        return {
          training_RequirementId: 0,
          courseId: this.courseId,
          name: m
        }
      })
      course_Requirements.push(course_Requirement);
      console.log(expected_Competence, facilitators, course_sector, course_Requirement);
      payload.course_Competence = expected_Competence[0];
      payload.facilitator = facilitators[0];
      payload.course_sector = course_sectors[0];
      payload.course_Requirement = course_Requirements[0];
      payload.apply_Discount == 'true' ? payload.apply_Discount = true : payload.apply_Discount = false;
      console.log(payload);
      this._courses.UpdateCourse(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this._router.navigate(['/training-provider/course-creation'])
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.courseFormSubmitted = false;
          this._helper.triggerErrorAlert('error')
        },
      });
    }
  }

}
