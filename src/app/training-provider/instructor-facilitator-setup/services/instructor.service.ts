import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Facilitator } from 'app/training-provider/instructor-information/models/instructor-information.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private http: HttpService) { }

  public getAllFaciltator(
  ): Observable<ResponseModel<Facilitator>> {
   const endpoint = '/lms/traininginstructor/getAllTraininginstructors';
   return this.http.getRequest(endpoint);
  }

  public getOneFaciltator(
    trainingInstructorId: string
  ): Observable<ResponseModel<Facilitator>> {
   const endpoint = '/lms/traininginstructor/get/byId/traininginstructor';
   const params = new HttpParams()
   .set('trainingInstructorId', trainingInstructorId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public AddNewFacilitator(
    faciliator: Facilitator
  ): Observable<ResponseModel<any>> {
    const endpoint = '/lms/instructorsignup';
    return this.http.makeRequestWithData('post', endpoint, {}, faciliator);
  }
}
