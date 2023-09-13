import { Component, OnInit } from '@angular/core';
import {
  InitialSearchDTO,
  // PaginationResponse,
  ResponseModel,
  SearchDTO,
} from 'app/models/response.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { Subscription } from 'rxjs';
import { Courses } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { UtilityService } from '@shared/services/utility.service';
import { ActionsService } from '@shared/services/action.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.scss']
})
export class CourseCreationComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public actionSub: Subscription = new Subscription();
  public courses: Courses[] = [];
  public isFetchingCourses:boolean = false;
  public isFetchngFacilitatorDetail:boolean = false;
  public loggedInUser: any;
  public loggedInId!: number;
  public createdBy!: number;
  public selectedCourses: Courses[] = [];
  public isInitialRequest: boolean = true;
  public searchQuery: SearchDTO = { ...InitialSearchDTO, search: '' };
  public viewHeight: any = '500px';
  public providerId!: number;


  constructor(
    private _course: CourseCreationService,
    public _helper: HelperService,
    private _current: CurrentUserService,
    private _route: ActivatedRoute,
    private utilitiesService: UtilityService,
    private _action: ActionsService,
    private _base: BaseComponent
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(param => {
      this.providerId = +param.q;
    })
    this.loggedInUser = this._current.getUser();
    this.actionSub = this._action.downloadEvent.subscribe(() => {
      this.downloadCourses();
    });
    this.getAllCourses();
  }

  public getAllCourses(): void {
    this._helper.startSpinner();
    this.isFetchingCourses = true;
    this.sub.add(
      this._course.getAllCourses(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          this.isFetchingCourses = false;
          this._helper.stopSpinner()
          // this.paginatedResponse = res?.response;
          this.courses = res['coursesSetupTypes'];
          if(this.providerId) {
            this.courses = this.courses.filter(c => {
              return +c.training_Provider === this.providerId;
            })
          }

          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingCourses = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  getDeliveryType(status: number) {
    let deliveryType;
    switch (status) {
      case 1:
        deliveryType = "Video";
        break;
      case 2:
        deliveryType = "Classroom";
        break;
      case 3:
        deliveryType = "Virtual";
        break;
    }
    return deliveryType;
  }

  getStatus(status: number) {
    let deliveryType;
    switch (status) {
      case 1:
        deliveryType = "Approved";
        break;
      case 2:
        deliveryType = "Disapproved";
        break;
      case 3:
        deliveryType = "Revert";
        break;
      default:
        deliveryType = "Pending";
    }
    return deliveryType;
  }

  public downloadCourses(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._course.downloadCourses().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.utilitiesService.byteToFile(res, "courses.xlsx");
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public suspendCourse(id: number): void {
    this._helper.startSpinner();
    this._course.suspendCourse(id).subscribe({
      next: (res: any) => {
        if(res == true) {
          this._helper.stopSpinner();
          // console.log(res)
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
          this.getAllCourses();
        } else {
          this._helper.stopSpinner();
          this._helper.triggerErrorAlert(res.status?.message?.friendlyMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        this._helper.stopSpinner();
        console.log(error);
        this._base.openSnackBar(
          error.error,
          'error'
        );
        // this.error_message = error?.error?.Id[0];
      },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.actionSub.unsubscribe();
  }

}
