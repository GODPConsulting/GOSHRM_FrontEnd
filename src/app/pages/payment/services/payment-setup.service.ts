import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class PaymentSetupService {
  constructor(private http: HttpService) {}

  public getPaymentSetup(): Observable<ResponseModel<any[]>> {
   const endpoint = '/setup/get/flutterwave';
   return this.http.getRequest(endpoint);
  }

  public addPaymentSetup(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/setup/add/flutterwave';
    return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }


}
