import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Profile, SocialMedia, Website } from '../models/user-profile.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

constructor(private http: HttpService) { }

  public getProfile(
    trainingInstructorId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/trainingprovidercompanyInfo/get/all/trainingprovidercompanyInfo';
      const params = new HttpParams()
      .set('trainingInstructorId', trainingInstructorId)
      return this.http.getRequestWithParams(endpoint, params);
  }

  public updateProfile(
      getProfile: Profile, trainingInstructorId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/trainingprovidercompanyInfo/add/update/trainingprovidercompanyInfo';
      const params = new HttpParams()
      .set('trainingInstructorId', trainingInstructorId)
      return this.http.makeRequestWithData('post', endpoint, params, getProfile);
  }

  public getSocialMedia(
    trainingInstructorId: string
 ): Observable<ResponseModel<Profile>> {
   const endpoint = '/trainingprovidersocialmedia/get/all/trainingprovidersocialmedia';
   const params = new HttpParams()
   .set('trainingInstructorId', trainingInstructorId)
   return this.http.getRequestWithParams(endpoint, params);
}

public updateSocialmedia(
   getSocialMedia: SocialMedia, trainingInstructorId: string
 ): Observable<ResponseModel<SocialMedia>> {
   const endpoint = '/trainingprovidersocialmedia/add/update/trainingprovidersocialmedia';
   const params = new HttpParams()
   .set('trainingInstructorId', trainingInstructorId)
   return this.http.makeRequestWithData('post', endpoint, params, getSocialMedia);
  }
}
