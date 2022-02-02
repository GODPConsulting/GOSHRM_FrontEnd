import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
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
    private _runningCourse: RunningCoursesService,
    private _current: CurrentUserService,
    private _helper: HelperService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    let trainingProviderId = this.loggedInUser.trainingProviderId;
    const profile = this._profile.getProfile(trainingProviderId);
    const socialMedia = this._profile.getSocialMedia(trainingProviderId);
    const website = this._profile.getWebsites(trainingProviderId);
    const payout = this._payout.getPayout(trainingProviderId);
    const runningCourse = this._runningCourse.getRunningCourses();
    this._helper.startSpinner();
    return forkJoin([profile, socialMedia, website, payout, runningCourse]).pipe(
      map(response => {
        this._helper.stopSpinner();
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
