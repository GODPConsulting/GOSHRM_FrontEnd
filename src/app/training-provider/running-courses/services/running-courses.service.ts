// import { HttpParams } from '@angular/common/http';
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
  ): Observable<ResponseModel<RunningCourses>> {
   const endpoint = '/lms/trainingproviderrunningcourses/get/all/trainingproviderrunningcourses';
   return this.http.getRequest(endpoint);
  }

  public updateRunningCourses(
    payout: RunningCourses
  ): Observable<ResponseModel<RunningCourses>> {
    const endpoint = '/lms//trainingprovidersecuritysetup/add/update/trainingprovidersecuritysetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
