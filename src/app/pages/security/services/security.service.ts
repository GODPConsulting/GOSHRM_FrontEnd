import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { Security } from '../models/security.model';

@Injectable({
  providedIn: 'root',
})

export class SecurityService {
  constructor(private http: HttpService) {}

  public updateSecuritySetup(
    payout: Security
  ): Observable<ResponseModel<Security>> {
    const endpoint = '/securitysetup/addAndUpdateSecuritysetup';
    return this.http.makeRequestWithData('post', endpoint, {}, payout);
  }
}
