import { Injectable } from '@angular/core';
import { Currency } from '@core/models/currencies.model';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CurrenciesService {
  constructor(private http: HttpService) {}

  public getAllCurrencies(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/common/currencies';
   return this.http.getRequest(endpoint);
  }

}

