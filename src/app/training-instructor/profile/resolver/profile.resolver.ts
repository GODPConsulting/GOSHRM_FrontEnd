import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
// import { RunningCoursesService } from 'app/training-provider/running-courses/services/running-courses.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<boolean> {
  constructor(
    private _profile: ProfileService,
    // private _runningCourse: RunningCoursesService,
    private _current: CurrentUserService,
    private _helper: HelperService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    let instructorId = this.loggedInUser.trainingInstructorId;
    const profile = this._profile.getProfile(instructorId);
  //   const socialMedia = this._profile.getSocialMedia(trainingProviderId);
  //  const runningCourse = this._runningCourse.getRunningCourses(trainingProviderId);
    this._helper.startSpinner();
    return forkJoin([profile]).pipe(
    // return forkJoin([profile, socialMedia, runningCourse]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          profile: response[0],
        };
      })
    );
  }
}