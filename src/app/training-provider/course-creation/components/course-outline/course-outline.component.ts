import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  public courseOutlines: CourseOutline[] = [];
  public isFetchingCourseOutlines: boolean = false;
  public loggedInUser: any;
  public courseId: any;

  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    public _current: CurrentUserService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    this.getAllCourseOutlines();
  }

  public getAllCourseOutlines(): void {
    this._helper.startSpinner();
    this.isFetchingCourseOutlines = true;
    this.sub.add(
      this._course.getAllCourseOutline(this.courseId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingCourseOutlines = false;
          this.courseOutlines = res['course_OutlineSetupTypes'];
          // console.log(res, this.courseOutlines)
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
    payload: { isEditing?: boolean; editObject?: CourseOutline } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(CourseOutlineDialogComponent, {
      data: object,
    });
    // console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
          const index = this.courseOutlines.findIndex((courseOutline: CourseOutline) => {
            return courseOutline.sectionId == event?.editObject?.sectionId;
          });
          this.courseOutlines[index] = event?.editObject;
        } else {
          this.courseOutlines = [event?.editObject, ...this.courseOutlines];
        }
      }
    );
  }

}