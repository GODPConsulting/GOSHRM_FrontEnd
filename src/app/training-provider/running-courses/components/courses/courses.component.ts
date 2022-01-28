import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';
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
  public isfetchingCourses: boolean = false;
  public loggedInUser: any;

  constructor(
    private _runningCourses: RunningCoursesService,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.getRunningCourses();
  }

  public getRunningCourses(): void {
    this.isfetchingCourses = true;
    this.sub.add(
      this._runningCourses.getRunningCourses(this.loggedInUser.trainingProviderId).subscribe({
        next: (res: any) => {
          this.isfetchingCourses = false;
          this.runningCourses = res['coursesSetupTypes'];
          console.log(res, this.runningCourses)
        },
        error: (error: ResponseModel<null>) => {
          this.isfetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

}
