import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FaqHelpService {

  constructor( private http: HttpService ) {}

  public getFaq(
    companyId: number
  ): Observable<ResponseModel<any>> {
    const param = new HttpParams()
    .set('companyId', companyId)
   const endpoint = '/privacy/getAllPolicySetup';
   return this.http.getRequestWithParams(endpoint, param);
  }

  public addUpdateFAQ(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/privacy/addAndUpdatePolicySetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

}
