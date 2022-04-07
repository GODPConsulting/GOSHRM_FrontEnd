import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Security } from '../models/security.model';

@Injectable({
  providedIn: 'root',
})

export class SecurityService {
  constructor(private http: HttpService) {}

  public getSecurity(
    trainingProviderId: string
  ): Observable<ResponseModel<Security>> {
   const endpoint = '/lms/trainingprovidersecuritysetup/get/all/trainingprovidersecuritysetup';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updateSecuritySetup(
    payout: Security
  ): Observable<ResponseModel<Security>> {
    const endpoint = '/lms/trainingprovidersecuritysetup/add/update/trainingprovidersecuritysetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
