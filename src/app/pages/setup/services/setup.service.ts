import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class SetupService {
  constructor(private http: HttpService) {}

  public getIndustries(): Observable<ResponseModel<any[]>> {
   const endpoint = '/setup/get/industry';
   return this.http.getRequest(endpoint);
  }

  public addUpdateIndustry(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/add/industry';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deleteIndustry(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/setup/delete/industry';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getSpecializations(): Observable<ResponseModel<any[]>> {
    const endpoint = '/setup/get/specialization';
    return this.http.getRequest(endpoint);
   }

   public addUpdateSpecialization(
     payload: any
   ): Observable<ResponseModel<any>> {
     const endpoint = '/setup/add/specialization';
     return this.http.makeRequestWithData('post', endpoint, {}, payload);
   }

   public deleteSpecialization(
     payload: any
   ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/delete/specialization';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
   }


}
