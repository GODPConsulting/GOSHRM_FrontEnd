import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseSectionDialogComponent } from '../../dialogs/course-section-dialog/course-section-dialog.component';
import { CourseOutline } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';
import { SwalConfig } from '../../../../_config/sweetalert';

@Component({
  selector: 'app-course-outline',
  templateUrl: './course-outline.component.html',
  styleUrls: ['./course-outline.component.scss']
})

export class CourseOutlineComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseOutlines: CourseOutline[] = [];
  public SelectedCourseOutlines: CourseOutline[] = [];
  public isFetchingCourseOutlines: boolean = false;
  public loggedInUser: any;
  public courseId: any;
  public outlineId: any;

  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    public _helper: HelperService,
    public _current: CurrentUserService,
    public _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this._route.queryParams.subscribe(params => {
      this.courseId = params.courseId;
      this.outlineId = params.outlineId;
    });
    this.getAllCourseOutlines();
  }

  public getAllCourseOutlines(): void {
    this._helper.startSpinner();
    this.isFetchingCourseOutlines = true;
    this.sub.add(
      this._course.getAllCourseSection(this.courseId, this.outlineId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingCourseOutlines = false;
          this.courseOutlines = res['course_Section'];
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
    const dialogRef = this.dialog.open(CourseSectionDialogComponent, {
      data: object,
    });
    console.log(payload)
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

  public deleteCourseOutline(SelectedCourseOutlines: any): void {
    SwalConfig.fire({
      // title: `Delete?`,
      // icon: 'question',
      html:`<p class="alert alert-danger"> 
                <span class="pe-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2908 3.8602L1.82075 18.0002C1.64612 18.3026 1.55372 18.6455 1.55274 18.9947C1.55176 19.3439 1.64224 19.6873 1.81518 19.9907C1.98812 20.2941 2.23748 20.547 2.53846 20.7241C2.83944 20.9012 3.18155 20.9964 3.53075 21.0002H20.4708C20.82 20.9964 21.1621 20.9012 21.463 20.7241C21.764 20.547 22.0134 20.2941 22.1863 19.9907C22.3593 19.6873 22.4497 19.3439 22.4488 18.9947C22.4478 18.6455 22.3554 18.3026 22.1808 18.0002L13.7108 3.8602C13.5325 3.56631 13.2815 3.32332 12.9819 3.15469C12.6824 2.98605 12.3445 2.89746 12.0008 2.89746C11.657 2.89746 11.3191 2.98605 11.0196 3.15469C10.72 3.32332 10.469 3.56631 10.2908 3.8602V3.8602Z" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 9V13" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16V16.5" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>                                              
                </span> 
                <span>Warning: You are about to delete a product from your draft!</span> 
            </p>`,
    }).then((result: any) => {
        if (result.value) {
          const courseIds = SelectedCourseOutlines.map((c: any) => c.outlineId)
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
    })
  }

}
