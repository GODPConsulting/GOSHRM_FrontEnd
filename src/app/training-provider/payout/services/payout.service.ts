import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Payout } from '../models/payout.model';

@Injectable({
  providedIn: 'root',
})

export class PayoutService {
  constructor(private http: HttpService) {}

  public getPayout(
    trainingProviderId: string
  ): Observable<ResponseModel<Payout>> {
   const endpoint = '/trainingproviderpayout/get/all/trainingproviderpayout';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updatePayoutSetup(
    payout: Payout
  ): Observable<ResponseModel<Payout>> {
    const endpoint = '/trainingproviderpayout/add/update/trainingproviderpayout';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
