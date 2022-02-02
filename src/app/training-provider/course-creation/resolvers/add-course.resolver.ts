import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrenciesService } from '@core/services/currencies.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddCourseResolver implements Resolve<boolean> {
  constructor(
    private _currency: CurrenciesService,
    private _current: CurrentUserService,
    private _helper: HelperService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    // let trainingProviderId = this.loggedInUser.trainingProviderId;
    const currency = this._currency.getAllCurrencies();
    this._helper.startSpinner();
    return forkJoin([currency]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          currency: response[0],
        };
      })
    );
  }
}

