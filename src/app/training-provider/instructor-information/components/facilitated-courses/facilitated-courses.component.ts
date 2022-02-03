import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { InstructorInformationService } from '../../services/instructor-information.service';

@Component({
  selector: 'app-facilitated-courses',
  templateUrl: './facilitated-courses.component.html',
  styleUrls: ['./facilitated-courses.component.scss']
})
export class FacilitatedCoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public facilitatedCourses: any[]= [];
  public isFetchngFacilitatedCourses: boolean = false;
  public loggedInuser: any;
  public instructorId: any;
  constructor(
    private _instructor: InstructorInformationService,
    private _current: CurrentUserService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInuser = this._current.getUser();
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    this.getFacilitatedCourses();
  }

  public getFacilitatedCourses(): void {
    this._helper.startSpinner();
    this.isFetchngFacilitatedCourses = true;
    this.sub.add(
      this._instructor.getFacilitatorCourses(this.instructorId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatedCourses = false;
          this.facilitatedCourses = res['facilated_CoursesSetupTypes'];
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
