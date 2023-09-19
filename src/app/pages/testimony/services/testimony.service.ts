import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class TestimonyService {
  constructor(private http: HttpService) {}

  public getTestimonies(): Observable<ResponseModel<any[]>> {
   const endpoint = '/setup/get/testimony';
   return this.http.getRequest(endpoint);
  }

  public addUpdateTestimony(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/add/testimony';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deleteTestimony(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/setup/delete/testimony';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

}
