import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Facilitator, FacilitatorCourses } from '../models/instructor-information.model';

@Injectable({
  providedIn: 'root',
})

export class InstructorInformationService {
  constructor(private http: HttpService) {}

  public getFaciltator(
    trainingProviderId: string
  ): Observable<ResponseModel<Facilitator>> {
   const endpoint = '/traininginstructor/get/all/traininginstructor';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateFaciltator(
    payout: Facilitator
  ): Observable<ResponseModel<Facilitator>> {
    const endpoint = '/traininginstructor/add/update/traininginstructor';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

  public getFacilitatorCourses(
    trainingProviderId: string
  ): Observable<ResponseModel<FacilitatorCourses>> {
   const endpoint = '/coursefacilitated/get/all/coursefacilitated';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updateFacilitatorCourses(
    payout: FacilitatorCourses
  ): Observable<ResponseModel<FacilitatorCourses>> {
    const endpoint = '/coursefacilitated/add/update/coursefacilitated';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
