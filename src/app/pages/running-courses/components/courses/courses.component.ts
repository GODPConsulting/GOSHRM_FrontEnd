import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { RunningCourses } from '../../models/running-course.model';
import { RunningCoursesService } from '../../services/running-courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public runningCourses: RunningCourses[] = [];
  public selectedCourses: RunningCourses[] = [];
  public isfetchingCourses: boolean = false;
  public loggedInUser: any;
  public viewHeight: string = '500px';

  constructor(
    private _runningCourses: RunningCoursesService,
    private _currentService: CurrentUserService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.getRunningCourses();
  }

  public getRunningCourses(): void {
    this._helper.startSpinner();
    this.isfetchingCourses = true;
    this.sub.add(
      this._runningCourses.getRunningCourses(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          console.log(res)
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this.runningCourses = res['coursesSetupTypes'];
          console.log(res, this.runningCourses)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

}
