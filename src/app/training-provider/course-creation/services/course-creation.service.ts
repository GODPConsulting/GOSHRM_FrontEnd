import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Courses } from '../models/course-creation.model';

@Injectable({
  providedIn: 'root',
})

export class CourseCreationService {
  constructor(private http: HttpService) {}

  public getAllCourses(
    trainingProviderId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/coursecreation/get/all/coursecreation';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourse(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/lms/coursecreation/add/update/coursecreation';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public getAllCourseOutline(
    trainingProviderId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/coursecreationcourseoutline/get/byId/coursecreationcourseoutline';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourseOutline(
    course: Courses, trainingProviderId: string
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/lms/coursecreationcourseoutline/add/update/coursecreationcourseoutline';
    const params = new HttpParams()
    .set('trainingProviderId', trainingProviderId)
    return this.http.makeRequestWithData('post', endpoint, params, course);
  }
}
