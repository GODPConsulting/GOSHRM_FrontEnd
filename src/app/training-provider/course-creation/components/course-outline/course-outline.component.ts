import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseOutlineDialogComponent } from '../../dialogs/course-outline-dialog/course-outline-dialog.component';
import { CourseOutline } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-course-outline',
  templateUrl: './course-outline.component.html',
  styleUrls: ['./course-outline.component.scss']
})

export class CourseOutlineComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseOtlines: CourseOutline[] = [];
  public isFetchingCourseOutlines: boolean = false;
  public loggedInUser: any;

  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    public _current: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.getAllCourseOutlines();
  }

  public getAllCourseOutlines(): void {
    this._helper.startSpinner();
    this.isFetchingCourseOutlines = true;
    this.sub.add(
      this._course.getAllCourseOutline(this.loggedInUser?.trainingProviderId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingCourseOutlines = false;
          this.courseOtlines = res['course_CreationSetupTypes'];
          console.log(res, this.courseOtlines)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingCourseOutlines = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(CourseOutlineDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          
      }
    );
  }

}
