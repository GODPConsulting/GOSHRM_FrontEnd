// import { HttpParams } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { RunningCourses } from '../models/running-course.model';

@Injectable({
  providedIn: 'root',
})

export class RunningCoursesService {
  constructor(private http: HttpService) {}

  public getRunningCourses(
    CompanyId: number
  ): Observable<ResponseModel<RunningCourses>> {
   const endpoint = '/runningcourse/getAllRunningcourse';
   const params = new HttpParams()
   .set('CompanyId', CompanyId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public downloadProviders(): Observable<ResponseModel<any>> {
   const endpoint = '/download/training/providers';
   return this.http.makeRequestWithData('post', endpoint, {});
  }

  public suspendProvider(
    providerId: number
  ): Observable<ResponseModel<any>> {
   const endpoint = '/training/provider/suspend';
   const param = new HttpParams()
   .set('trainingProviderId', providerId)
   return this.http.getRequestWithParams(endpoint, param);
  }

  public updateRunningCourses(
    payout: RunningCourses
  ): Observable<ResponseModel<RunningCourses>> {
    const endpoint = '/trainingprovidersecuritysetup/add/update/trainingprovidersecuritysetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

  public getAllTrainers(
    companyId: string
  ): Observable<ResponseModel<any>> {
    const endpoint = '/trainingproviders/getAllTrainingproviders';
    const params = new HttpParams()
    .set('companyId', companyId)
    return this.http.getRequestWithParams(endpoint, params);
  }
}
