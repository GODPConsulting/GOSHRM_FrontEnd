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
   const endpoint = '/lms/runningcourse/getAllRunningcourse';
   const params = new HttpParams()
   .set('CompanyId', CompanyId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updateRunningCourses(
    payout: RunningCourses
  ): Observable<ResponseModel<RunningCourses>> {
    const endpoint = '/lms//trainingprovidersecuritysetup/add/update/trainingprovidersecuritysetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
