import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseDescriptionService } from '../../services/course-description.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { AddAdminDialogComponent } from '../../dialogs/add-admin-dialog/add-admin-dialog.component';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-course-description',
  templateUrl: './course-description.component.html',
  styleUrls: ['./course-description.component.scss']
})
export class CourseDescriptionComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public admins: any[] = [];
  public selectedAdmins: any[] = [];
  public isfetchingCourses: boolean = false;
  public courseId: any;
  public viewHeight: string = '450px';
  public loggedInUser!: any;
  public userActivities: any;

  constructor(
    private _course: CourseDescriptionService,
    private _helper: HelperService,
    private _route: ActivatedRoute,
    private dialog: MatDialog,
    private _current: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.userActivities = this.loggedInUser.activities.find((a: any) => {
      return a.name === 'Admin';
    });
    window.scroll(0,0);
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    this.getCoursesDetail();
  }

  public getCoursesDetail(): void {
    this._helper.startSpinner();
    this.isfetchingCourses = true;
    this.sub.add(
      this._course.getAllAdmins().subscribe({
        next: (res: any) => {
          console.log(res)
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this.admins = res['admins'];
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {
      data: object,
      panelClass: 'modal-width'
    });
    // console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        this.getCoursesDetail();
      }
    );
  }



}
