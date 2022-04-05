import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { ParticipantDialogComponent } from '../../dialogs/participant-dialog/participant-dialog.component';
import { Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.scss']
})
export class CourseCreationComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courses: Courses[] = [];
  public isFetchingCourses:boolean = false;
  public loggedInUser: any;
  public createdBy = CreatedByType;
  public selectedCourses: Courses[] = [];
  
  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    private _current: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.getAllCourses();
  }

  public getAllCourses(): void {
    const payload = {
      searchParams: "",
      id: this.loggedInUser?.trainingProviderId,
      type: this.createdBy.provider
    }
    this._helper.startSpinner();
    this.isFetchingCourses = true;
    this.sub.add(
      this._course.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingCourses = false;
          this.courses = res['course_CreationSetupTypes'];
          console.log(res, this.courses)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public goTo() {
    this.router.navigate(['/training-provider/course-creation/add-course'])
  }

  public selectDeselectCourses(course: Courses) {
    this.selectedCourses.includes(course)
      ? (this.selectedCourses = this.selectedCourses.filter((c: any) => c!== course))
      : this.selectedCourses.push(course);
    console.log(this.selectedCourses)
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(ParticipantDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          
      }
    );
  }

  public deleteCourses(): void {
    const courseIds = this.selectedCourses.map(c => c.courseId)
    const payload = {
      courseIds:courseIds
    };
    if (payload.courseIds.length > 0) {
      this._helper.startSpinner();
     console.log(payload)
      this._course.deleteCourses(payload.courseIds).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getAllCourses();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      });
    }
  }

}
