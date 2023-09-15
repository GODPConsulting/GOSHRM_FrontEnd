import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class UserActivitiesService {
  constructor(private http: HttpService) {}

  public getAllPages(): Observable<ResponseModel<any[]>> {
   const endpoint = '/setup/get/admin/pages';
   return this.http.getRequest(endpoint);
  }

  public getAllUserRoles(): Observable<ResponseModel<any[]>> {
    const endpoint = '/setup/get/userrole';
    return this.http.getRequest(endpoint);
   }

  public getUserRolesById(
    userRoleId: number
  ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/get/userrole/Id';
    const param = new HttpParams()
    .set('userroleId', userRoleId)
    return this.http.getRequestWithParams(endpoint, param);
   }

  public addUpdateUserRole(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/add/userrole';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deleteUserRole(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/setup/delete/userrole';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

}
