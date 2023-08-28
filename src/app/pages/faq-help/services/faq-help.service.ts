import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FaqHelpService {

  constructor( private http: HttpService ) {}

  public getFaq(): Observable<ResponseModel<any>> {
   const endpoint = '/getFAQs';
   return this.http.getRequest(endpoint);
  }

  public addUpdateFAQ(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/addFAQ';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

}
