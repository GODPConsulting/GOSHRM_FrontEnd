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
    companyId: string
  ): Observable<ResponseModel<Facilitator>> {
   const endpoint = '/pagecontentsetup/getAllPageContent';
   const params = new HttpParams()
   .set('companyId', companyId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public uploadContentImage(
    payout: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/pagecontentsetup/addAndUpdatePageImage';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

  public getFacilitatorCourses(
    companyId: number
  ): Observable<ResponseModel<FacilitatorCourses>> {
   const endpoint = '/pagecontentsetup/getAllPageContent';
   const params = new HttpParams()
   .set('companyId', companyId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updateFacilitatorCourses(
    payout: FacilitatorCourses
  ): Observable<ResponseModel<FacilitatorCourses>> {
    const endpoint = '/coursecreationfacilitatedcourse/add/update/coursecreationfacilitatedcourse';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

  public deleteContent(
    payload: any
  ): Observable<ResponseModel<FacilitatorCourses>> {
    const endpoint = '/pagecontentsetup/DeletePageContent';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public addUpdateBanner(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/pagebannersetup/addAndUpdatePageBannerSetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public addUpdateContent(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/pagecontentsetup/addAndUpdatePageContentSetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }
}
