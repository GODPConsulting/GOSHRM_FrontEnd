import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { DialogModel } from '@shared/components/models/dialog.model';
import { InitialSearchDTO, ResponseModel, SearchDTO } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { CourseCreationService } from 'app/pages/course-creation/services/course-creation.service';
import { Subscription } from 'rxjs';
import { DecisionDialogComponent } from '../../dialogs/decision-dialog/decision-dialog.component';

@Component({
  selector: 'app-course-approval',
  templateUrl: './course-approval.component.html',
  styleUrls: ['./course-approval.component.scss']
})
export class CourseApprovalComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courses: Courses[] = [];
  public isFetchingCourses:boolean = false;
  public loggedInUser: any;
  public createdBy = CreatedByType;
  public selectedCourses: Courses[] = [];
  public isInitialRequest: boolean = true;
  public searchQuery: SearchDTO = { ...InitialSearchDTO, search: '' };
  public viewHeight: string = '500px';

  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    private _current: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.getAllCourses(true);
  }

  public getAllCourses(
    initial: boolean,
    isPagination?: boolean,
    pageEvent?: PageEvent
  ): void {
    if (pageEvent) {
      this.searchQuery = {
        search: this.searchQuery?.search,
        pageNumber: pageEvent?.pageIndex + 1,
        pageSize: pageEvent?.pageSize,
      };
    }
    initial ? (this.isInitialRequest = true) : (this.isInitialRequest = false);
    const payload = {
      searchParams: this.searchQuery.search,
      id: this.loggedInUser?.trainingProviderId,
      type: this.createdBy.provider
    }
    this.isFetchingCourses = true;
    this.sub.add(
      this._course.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this.isFetchingCourses = false;
          // this.paginatedResponse = res?.response;
          this.courses = res['course_CreationSetupTypes'];

          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public getSearchQuery(searchQuery: string): void {
    this.searchQuery.search = searchQuery;
    console.log(this.searchQuery.search)
  }

  public goTo() {
    this.router.navigate(['/training-provider/courses/add-course'])
  }

  public openDecisionDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(DecisionDialogComponent, {
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
          this.getAllCourses(true);
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
