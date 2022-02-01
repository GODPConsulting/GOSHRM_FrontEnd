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
    instructorId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/traininginstructor/get/all/traininginstructor';
      const params = new HttpParams()
      .set('trainingProviderId', instructorId)
      return this.http.getRequestWithParams(endpoint, params);
  }

  public updateProfile(
      getProfile: Profile, trainingProviderId: string
    ): Observable<ResponseModel<Profile>> {
      const endpoint = '/traininginstructor/add/update/traininginstructor';
      const params = new HttpParams()
      .set('trainingProviderId', trainingProviderId)
      return this.http.makeRequestWithData('post', endpoint, params, getProfile);
  }

  public getSocialMedia(
    trainingProviderId: string
 ): Observable<ResponseModel<Profile>> {
   const endpoint = '/trainingprovidersocialmedia/get/all/trainingprovidersocialmedia';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.getRequestWithParams(endpoint, params);
}

public updateSocialmedia(
   getSocialMedia: SocialMedia, trainingProviderId: string
 ): Observable<ResponseModel<SocialMedia>> {
   const endpoint = '/trainingprovidersocialmedia/add/update/trainingprovidersocialmedia';
   const params = new HttpParams()
   .set('trainingProviderId', trainingProviderId)
   return this.http.makeRequestWithData('post', endpoint, params, getSocialMedia);
}

public getWebsites(
  trainingProviderId: string
): Observable<ResponseModel<Profile>> {
 const endpoint = '/trainingproviderwebsite/get/all/trainingproviderwebsite';
 const params = new HttpParams()
 .set('trainingProviderId', trainingProviderId)
 return this.http.getRequestWithParams(endpoint, params);
}

  public updateWebsites(
  getWebsite: Website, trainingProviderId: string
  ): Observable<ResponseModel<Website>> {
  const endpoint = '/trainingproviderwebsite/add/update/trainingproviderwebsite';
  const params = new HttpParams()
  .set('trainingProviderId', trainingProviderId)
  return this.http.makeRequestWithData('post', endpoint, params, getWebsite);
  }

}
