import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { CourseCreationService } from 'app/training-provider/course-creation/services/course-creation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-facilitated-courses',
  templateUrl: './facilitated-courses.component.html',
  styleUrls: ['./facilitated-courses.component.scss']
})
export class FacilitatedCoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public facilitatedCourses: any[]= [];
  public isFetchngFacilitatedCourses: boolean = false;
  public loggedInUser: any;
  public instructorId: any;
  public createdBy = CreatedByType;

  constructor(
    private _courses: CourseCreationService,
    private _current: CurrentUserService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    this.getFacilitatedCourses();
  }

  public getFacilitatedCourses(): void {
    const payload = {
      searchParams: "",
      id: this.loggedInUser?.trainingProviderId,
      type: this.createdBy.instructor
    }
    this._helper.startSpinner();
    this.isFetchngFacilitatedCourses = true;
    this.sub.add(
      this._courses.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatedCourses = false;
          this.facilitatedCourses = res['course_CreationSetupTypes'];
          console.log(res, this.facilitatedCourses)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatedCourses = false;
          console.log(error);
        },
      })
    );
  }

}
