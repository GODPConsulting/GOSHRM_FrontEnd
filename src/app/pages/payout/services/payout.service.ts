import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatedByType } from '@core/models/creation-type.model';
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
  public createdBy: number;

  constructor(
    private http: HttpService,
    private _currentService: CurrentUserService,
  ) {
    this.loggedInUser = this._currentService.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.userId = this.loggedInUser.userId;
    this.createdBy = CreatedByType.admin;
  }

  public getPayout(): Observable<ResponseModel<Payout>> {
   const endpoint = '/payout/getAllPayOutSetup';
   const params = new HttpParams()
   .set('companyId', this.companyId)
   .set('type', this.createdBy)
   .set('userid', 'company');
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updatePayoutSetup(
    payload: any
  ): Observable<ResponseModel<Payout>> {
    const endpoint = '/payout/addAndUpdatePayOutSetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deletePayout(
    payload: any,
  ): Observable<ResponseModel<Payout>> {
    const endpoint = '/payoutsetup/deletePayoutsetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }
}
