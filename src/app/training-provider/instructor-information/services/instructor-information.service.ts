import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { PageBanner, PageContent } from '../models/instructor-information.model';

@Injectable({
  providedIn: 'root',
})

export class InstructorInformationService {
  constructor(private http: HttpService) {}

  public getPageBanner(
    trainingProviderId: string
  ): Observable<ResponseModel<PageBanner>> {
   const endpoint = '/trainingproviderpagebanner/get/all/trainingproviderpagebanner';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updatePageBanner(
    payout: PageBanner
  ): Observable<ResponseModel<PageBanner>> {
    const endpoint = '/trainingproviderpagebanner/add/update/trainingproviderpagebanner';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }

  public getPageContent(
    trainingProviderId: string
  ): Observable<ResponseModel<PageContent>> {
   const endpoint = '/trainingproviderpagecontent/get/all/trainingproviderpagecontent';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public updatePagecontent(
    payout: PageContent
  ): Observable<ResponseModel<PageContent>> {
    const endpoint = '/trainingproviderpagecontent/add/update/trainingproviderpagecontent';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
