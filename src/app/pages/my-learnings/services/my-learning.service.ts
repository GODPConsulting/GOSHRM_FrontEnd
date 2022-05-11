import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class MyLearningService {
  constructor(private http: HttpService) {}

  public getMyLearningCourses(): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/getParticipantMyLearning';
   return this.http.getRequest(endpoint);
  }

  public getCartAndWhilst(
    type: number
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/getCoursesFromCart';
   const params = new HttpParams()
   .set('type', type)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public requestCourse(
    payout: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/trainingparticipant/requestCourse';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

}
