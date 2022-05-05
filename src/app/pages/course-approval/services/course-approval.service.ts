import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseApprovalService {

  constructor(private http: HttpService) { }

  public getAllCourseToBeApprove(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/coursecreation/getCoursesToBeApprove';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public ApproveCourse(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/course/courseApproval';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }
}
