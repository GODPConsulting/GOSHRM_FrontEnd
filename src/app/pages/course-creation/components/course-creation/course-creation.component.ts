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

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.scss']
})
export class CourseCreationComponent implements OnInit {
  public sub: Subscription = new Subscription();
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


  constructor(
    private _course: CourseCreationService,
    public _helper: HelperService,
    private _current: CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
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


}
