import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseApprovalService {

  constructor(private http: HttpService) { }

  public addEmailSetup(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/emailsetup/addAndUpdateEmailSetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getEmailSetup(
    companyId: number
  ): Observable<ResponseModel<any>> {
    const param = new HttpParams()
    .set('companyId', companyId)
    const endpoint = '/emailsetup/getAllEmailSetup';
    return this.http.getRequestWithParams(endpoint, param);
  }

  public testEmail(
    email: string
  ): Observable<ResponseModel<any>> {
    const param = new HttpParams()
    .set('email', email)
    const endpoint = '/email/test/mail';
    return this.http.getRequestWithParams(endpoint, param);
  }

}
