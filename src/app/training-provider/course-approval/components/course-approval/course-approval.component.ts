import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from 'app/training-provider/course-creation/models/course-creation.model';
import { CourseCreationService } from 'app/training-provider/course-creation/services/course-creation.service';
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

  goTo() {
    this.router.navigate(['/training-provider/course-creation/add-course'])
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

  public openDialog(
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

}
