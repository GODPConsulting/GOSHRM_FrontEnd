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
import { CompanyService } from '@core/services/company.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseOutline, OutlineType, MediaType, Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-schedule-class-dialog',
  templateUrl: './schedule-class-dialog.component.html',
  styleUrls: ['./schedule-class-dialog.component.scss']
})

export class ScheduleClassDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public scheduleClassForm!: FormGroup;
  public loggedInUser: any;
  public outlineType = OutlineType;
  public mediaType = MediaType;
  public courseId: any;
  public documentUrl: any;
  public course!: Courses;
  public sessionType: any[] = [
    {id: 1, name: 'Public'},
    {id: 2, name: 'Private'},
    {id: 3, name: 'In-house'},
  ];
  public isInHouseOnline: boolean = false;
  public isPrivateOnline: boolean = false;
  public isInHouseOthers: boolean = false;
  public isPrivateOthers: boolean = false;
  public isPrivateVirtual: boolean = false;
  public allJobTitles: any[] = [];
  public allJobGrades: any[] = [];
  public allOffices: any[] = [];
  public allStaffs: any[] = [];
  public filteredStaffs: any[] = [];
  public isFetchingJobTitles: boolean = false;
  public isFetchingJobGrades: boolean = false;
  public isFetchinOffices: boolean = false;
  public isFetchingStaffs: boolean = false;
  
  @Output() event: EventEmitter<{
    editObject?: CourseOutline;
    isEditing: boolean;
    course: Courses
  }> = new EventEmitter<{ editObject?: CourseOutline; isEditing: boolean, course: Courses }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<CourseOutline>,
    public fb: FormBuilder,
    public _helper: HelperService,
    private _course: CourseCreationService,
    private _current: CurrentUserService,
    private activateRoute: ActivatedRoute,
    private _company: CompanyService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    this.courseId = this.activateRoute.snapshot.paramMap.get('courseId');
    this.course = this.data.course;
    this.initScheduleClassForm();
    this.checkFormValidation();
    this.getAllJobTitles();
    this.getJobGrades();
    this.getAllOffices();
    this.getAllStaffs();
  }

  public getAllJobTitles(): void {
    this.isFetchingJobTitles = true;
    this.sub.add(
      this._company.getJobTitles().subscribe({
        next: (res: any) => {
          this.isFetchingJobTitles = false;
          // console.log(res);
          this.allJobTitles = res['setuplist'];
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingJobTitles = false;
          console.log(error);
        },
      })
    );
  }

  public getJobGrades(): void {
    this.isFetchingJobGrades = true;
    this.sub.add(
      this._company.getJobGrades().subscribe({
        next: (res: any) => {
          this.isFetchingJobGrades = false;
          // console.log(res);
          this.allJobGrades = res['setuplist'];
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingJobGrades = false;
          console.log(error);
        },
      })
    );
  }

  public getAllOffices(): void {
    this.isFetchinOffices = true;
    this.sub.add(
      this._company.getDepartments().subscribe({
        next: (res: any) => {
          this.isFetchinOffices = false;
          // console.log(res);
          this.allOffices = res['companyStructures'];
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchinOffices = false;
          console.log(error);
        },
      })
    );
  }

  public getAllStaffs(): void {
    this.isFetchingStaffs = true;
    this.sub.add(
      this._company.getAllEmployees().subscribe({
        next: (res: any) => {
          this.isFetchingStaffs = false;
          // console.log(res);
          this.allStaffs = this.filteredStaffs = res['employeeList'];
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingStaffs = false;
          console.log(error);
        },
      })
    );
  }

  public initScheduleClassForm() {
    this.scheduleClassForm = this.fb.group({
      scheduleId: [0, Validators.required],
      jobTitles: [],
      jobGrades: [],
      offices: [],
      eligibleToTakeCourse: [this.allStaffs],
      participants: [],
      trainingDate: [new Date()],
      duration: [''],
      endTime: [new Date()],
      startTime: [new Date()],
      courseId: [+this.data.course.courseId]
    })
  }

  public checkFormValidation() {
    this.isInHouseOnline = this.data.course.delivery_Type == 'online' &&
                          this.data.course.scheduleType == 'Inhouse';
    this.isPrivateOnline = this.data.course.delivery_Type == 'online' &&
                          this.data.course.scheduleType == 'private';
    this.isInHouseOthers = this.data.course.delivery_Type != 'online' &&
                          this.data.course.scheduleType == 'Inhouse';
    this.isPrivateOthers = this.data.course.delivery_Type != 'online' &&
                          this.data.course.scheduleType == 'private';
    this.isPrivateVirtual = this.data.course.delivery_Type == 'virtual' &&
                          this.data.course.scheduleType == 'private';
  }

  public filterStaffTitle() {
    let jobTitles = this.scheduleClassForm.get('jobTitles')?.value;
    let staffsPerTitles =  [];
    // console.log(jobTitles);
    let staffsPerTitle = [];
    if(this.filteredStaffs.length == 0) {
      staffsPerTitle = this.allStaffs.filter((staff: any) => {
        return jobTitles.find((id: number) => {
          return id === staff.jobTitle;
        })
      });
    } else {
      staffsPerTitle = this.filteredStaffs.filter((staff: any) => {
        return jobTitles.find((id: number) => {
          return id === staff.jobTitle;
        })
      });
    }
    // console.log(staffsPerTitle)
    staffsPerTitles.push(staffsPerTitle);
    this.filteredStaffs = staffsPerTitles[0];
    // console.log(staffsPerTitles, this.filteredStaffs);
  }

  public filterStaffPerGrade() {
    let jobGrades = this.scheduleClassForm.get('jobGrades')?.value;
    let staffsPerGrades = [];
    // console.log(jobGrades);
    let staffsPerGrade = []
    if(this.filteredStaffs.length == 0){
        staffsPerGrade = this.allStaffs.filter((staff: any) => {
        return jobGrades.find((id: number) => {
          return id === staff.jobGrade;
        })
      })
    } else {
      staffsPerGrade = this.filteredStaffs.filter((staff: any) => {
        return jobGrades.find((id: number) => {
          return id === staff.jobGrade;
        })
      })
    };
    // console.log(staffsPerGrade)
    staffsPerGrades.push(staffsPerGrade);
    this.filteredStaffs = staffsPerGrades[0];
    // console.log(staffsPerGrades, this.filteredStaffs);
  }

  public filterStaffPerOffice() {
    let jobOffices = this.scheduleClassForm.get('offices')?.value;
    let staffsPerOffices = [];
    // console.log(jobOffices);
    let staffsPerOffice = [];
    if(this.filteredStaffs.length == 0){
      staffsPerOffice = this.allStaffs.filter((staff: any) => {
      return jobOffices.find((id: number) => {
          return id === staff.staffOfficeId;
        })
      })
    } else {
      this.filteredStaffs.filter((staff: any) => {
        return jobOffices.find((id: number) => {
          return id === staff.staffOfficeId;
        })
      })
    };
    // console.log(staffsPerOffice)
    staffsPerOffices.push(staffsPerOffice);
    this.filteredStaffs = staffsPerOffices[0];
    // console.log(staffsPerOffices, this.filteredStaffs);
  }

  public submit() {
    this._helper.startSpinner();
    const payload = this.scheduleClassForm.value;
    let participants = []
    let user = this.allStaffs.filter(user => {
      return payload.participants.find((m : any) => {
        return m === user.employeeId
      })
    });
    let participant = user.map((c: any) => {
      return {
        employeeId: c.employeeId,
        jobTitle: c.jobTitleName,
        jobTitleId: c.jobTitle,
        jobGrade: c.jobGradeName,
        jobGradeId: c.jobGrade,
        department: c.staffOfficeName,
        departmentId: c.staffOfficeId,
      }
    })
    participants.push(participant);
    payload.participants = participants[0];
    payload.trainingDate = new Date(payload.trainingDate).toISOString();
    delete payload.jobTitles;
    delete payload.jobGrades;
    delete payload.offices;
    // console.log(payload);
    this.sub.add(
      this._course.createScheduleClass(payload).subscribe({
        next: (res: any) => {
          // console.log(res);
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
              course: this.course
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

