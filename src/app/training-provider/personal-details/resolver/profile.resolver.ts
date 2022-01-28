import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { PayoutService } from 'app/training-provider/payout/services/payout.service';
import { RunningCoursesService } from 'app/training-provider/running-courses/services/running-courses.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<boolean> {
  constructor(
    private _profile: ProfileService,
    private _payout: PayoutService,
    private _runningCourse: RunningCoursesService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const profile = this._profile.getProfile('1011');
    const socialMedia = this._profile.getSocialMedia('1011');
    const website = this._profile.getWebsites('1011');
    const payout = this._payout.getPayout('1011');
    const runningCourse = this._runningCourse.getRunningCourses('1');
    // this.helper.startSpinner();
    return forkJoin([profile, socialMedia, website, payout, runningCourse]).pipe(
      map(response => {
        // this.helper.stopSpinner();
        return {
          profile: response[0],
          socialMedia: response[1],
          website: response[2],
          payout: response[3],
          runningCourse: response[4],
        };
      })
    );
  }
}
