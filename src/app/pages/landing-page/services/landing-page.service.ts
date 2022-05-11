import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LandingPageService {
  constructor(private http: HttpService) {}

  public getParticipantCourses(): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/getParticipantCourses';
   return this.http.getRequest(endpoint);
  }

  public addCartAndWhilst(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/trainingparticipant/addCourseToCart';
    const params =  new HttpParams()
    .set('courseId', payload.courseId)
    .set('type', payload.type)
    .set('cartId', payload.cartId)
    return this.http.makeRequestWithData('post', endpoint, params);
  }

  public removeCartAndWhilst(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/trainingparticipant/removeCourseFromCart';
    const params =  new HttpParams()
    .set('courseId', payload.courseId)
    .set('type', payload.type)
    .set('cartId', payload.cartId)
    return this.http.makeRequestWithData('post', endpoint, params);
  }

  public requestCourse(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/trainingparticipant/requestCourse';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

}
