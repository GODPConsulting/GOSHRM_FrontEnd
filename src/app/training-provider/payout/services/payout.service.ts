import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Payout } from '../models/payout.model';

@Injectable({
  providedIn: 'root',
})

export class PayoutService {
  public loggedInUser: any;
  public companyId: any;
  public userId: any;

  constructor(
    private http: HttpService,
    private _currentService: CurrentUserService,
  ) {
    this.loggedInUser = this._currentService.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.userId = this.loggedInUser.userId;
  }

  public getPayout(): Observable<ResponseModel<Payout>> {
   const endpoint = '/lms/payout/getAllPayOutSetup';
   const params = new HttpParams()
   .set('companyId', this.companyId)
   .set('type', '2')
   .set('userid', this.userId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updatePayoutSetup(
    payload: any
  ): Observable<ResponseModel<Payout>> {
    const endpoint = '/lms/payout/addAndUpdatePayOutSetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deletePayout(
    payload: any,
  ): Observable<ResponseModel<Payout>> {
    const endpoint = '/lms/payoutsetup/deletePayoutsetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }
}
