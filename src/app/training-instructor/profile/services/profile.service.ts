import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Profile } from '../models/user-profile.model';
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
  public createdBy = CreatedByType;

  constructor(
    private http: HttpService,
    private _currentService: CurrentUserService,
  ) { 
    this.loggedInUser = this._currentService.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.userId = this.loggedInUser.userId;
  }

  public getProfile(
       trainingProviderId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/lms/trainingprovider/getTrainingProviderById';
      const params = new HttpParams()
      .set('trainingProviderId', trainingProviderId)
      return this.http.getRequestWithParams(endpoint, params);
  }

  public updateProfile(
      getProfile: Profile
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/lms/traininginstructor/addaAndUpdateTraininginstructor';
      return this.http.makeRequestWithData('post', endpoint, {}, getProfile);
  }

  public getSocialMedia(): Observable<ResponseModel<Profile>> {
   const endpoint = '/lms/socialMedia/getAllSocialMedias';
   const params = new HttpParams()
   .set('companyId', 2)
   .set('type', this.createdBy.instructor)
   .set('userid', this.userId);
   return this.http.getRequestWithParams(endpoint, params);
}

public updateSocialmedia(
   getSocialMedia: any
 ): Observable<ResponseModel<any>> {
   const endpoint = '/lms/socialMedia/addAndUpdateSocialMedia';
  console.log(getSocialMedia)
   return this.http.makeRequestWithData('post', endpoint, {}, getSocialMedia);
}

}
