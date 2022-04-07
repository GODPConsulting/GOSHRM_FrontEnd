import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseApprovalService {

  constructor(private http: HttpService) { }

  public ApproveCourse(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/lms/course/courseApproval';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }
}
