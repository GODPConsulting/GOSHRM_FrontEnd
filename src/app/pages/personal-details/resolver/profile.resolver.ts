import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { PayoutService } from 'app/pages/payout/services/payout.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';
import { RunningCoursesService } from 'app/pages/training-providers/services/running-courses.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<boolean> {
  profile: any;
  constructor(
    private _profile: ProfileService,
    private _payout: PayoutService,
    private _current: CurrentUserService,
    private _helper: HelperService,
    private _trainers: RunningCoursesService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    let companyId = this.loggedInUser.companyId;
    const profile = this._profile.getProfile(companyId);
    const socialMedia = this._profile.getSocialMedia();
    const website = this._profile.getWebsites();
    const payout = this._payout.getPayout();
    const trainers = this._trainers.getAllTrainers(companyId);
    this._helper.startSpinner();
    return forkJoin([profile, socialMedia, website, payout, trainers]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          profile: response[0],
          socialMedia: response[1],
          website: response[2],
          payout: response[3],
          trainers: response[4],
        };
      })
    );
  }
}
