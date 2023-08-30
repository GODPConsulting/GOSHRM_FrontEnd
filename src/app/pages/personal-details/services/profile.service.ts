import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Profile, Website } from '../models/user-profile.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CurrentUserService } from '@core/services/current-user.service';
import { CreatedByType } from '@core/models/creation-type.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public loggedInUser: any;
  public companyId: any;
  public userId: any;
  public createdBy: number;

  constructor(
    private http: HttpService,
    private _currentService: CurrentUserService,
  ) {
    this.loggedInUser = this._currentService.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.userId = this.loggedInUser.userId;
    this.createdBy = CreatedByType.admin;
  }

  public getProfile(
       companyId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/company/getCompanyInfoById';
      const params = new HttpParams()
      .set('CompanyId', companyId)
      return this.http.getRequestWithParams(endpoint, params);
  }

  public getInstructorProfile(
       trainingProviderId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/trainingprovider/getTrainingProviderById';
      const params = new HttpParams()
      .set('trainingProviderId', trainingProviderId)
      return this.http.getRequestWithParams(endpoint, params);
  }

  public updateProfile(
      getProfile: Profile
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/company/addAndUpdateCompanyInfo';
      return this.http.makeRequestWithData('post', endpoint, {}, getProfile);
  }

  public getSocialMedia(): Observable<ResponseModel<Profile>> {
   const endpoint = '/socialMedia/getAllSocialMedias';
   const params = new HttpParams()
   .set('companyId', this.companyId)
   .set('type', this.createdBy)
   .set('userid', 'company');
   return this.http.getRequestWithParams(endpoint, params);
}

public updateSocialmedia(
   getSocialMedia: any
 ): Observable<ResponseModel<any>> {
   const endpoint = '/socialMedia/addAndUpdateSocialMedia';
  console.log(getSocialMedia)
   return this.http.makeRequestWithData('post', endpoint, {}, getSocialMedia);
}

public getWebsites(): Observable<ResponseModel<Profile>> {
 const endpoint = '/website/getWebsiteById';
 const params = new HttpParams()
 .set('companyId', this.companyId)
 .set('type', this.createdBy)
 .set('userid', 'company');
 return this.http.getRequestWithParams(endpoint, params);
}

  public updateWebsites(
    getWebsite: any
    ): Observable<ResponseModel<Website>> {
    const endpoint = '/website/addAndUpdateWebsite';
    return this.http.makeRequestWithData('post', endpoint, {}, getWebsite);
  }

  public updateProfileImg(
    payload: any
    ): Observable<ResponseModel<Website>> {
    const endpoint = '/company/addAndUpdateCompanyLogo';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }


}
