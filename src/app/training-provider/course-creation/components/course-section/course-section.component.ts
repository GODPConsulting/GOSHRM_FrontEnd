import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseOutlineDialogComponent } from '../../dialogs/course-outline-dialog/course-outline-dialog.component';
import { CourseOutline } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.scss']
})
export class CourseSectionComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseSections: CourseOutline[] = [];
  public SelectedCourseOutlines: CourseOutline[] = [];
  public isFetchingCourseOutlines: boolean = false;
  public loggedInUser: any;
  public courseId: any;

  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    public _current: CurrentUserService,
    public _route: ActivatedRoute,
    private router: Router
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
          this.courseSections = res['course_OutlineSetupTypes'];
          // console.log(res, this.courseSections)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingCourseOutlines = false;
          console.log(error);
        },
      })
    );
  }

  public goToOutline(outline: any) {
    this.router.navigate(['/training-provider/course-creation/course-outline'], {
      queryParams: {courseId: this.courseId, outlineId: outline?.courseId},
    });
  }

  public selectDeselectOutline(outline: CourseOutline) {
    this.SelectedCourseOutlines.includes(outline)
      ? (this.SelectedCourseOutlines = this.SelectedCourseOutlines.filter((c: any) => c!== outline))
      : this.SelectedCourseOutlines.push(outline);
    console.log(this.SelectedCourseOutlines)
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
          const index = this.courseSections.findIndex((courseOutline: CourseOutline) => {
            return courseOutline.sectionId == event?.editObject?.sectionId;
          });
          this.courseSections[index] = event?.editObject;
        } else {
          this.courseSections = [event?.editObject, ...this.courseSections];
        }
      }
    );
  }

  public deleteCourseOutline(SelectedCourseOutlines: any): void {
    const courseIds = SelectedCourseOutlines.map((c: any) => c.sectionId)
    const payload = {
      courseIds:courseIds
    };
    if (payload.courseIds.length > 0) {
      this._helper.startSpinner();
     console.log(payload)
      this._course.deleteSectionOuline(payload.courseIds).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getAllCourseOutlines();
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

