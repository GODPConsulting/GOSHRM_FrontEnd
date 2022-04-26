import { Injectable } from '@angular/core';
import { Currency } from '@core/models/currencies.model';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CompanyService {
  constructor(private http: HttpService) {}

  public getJobTitles(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/employee/hrmsetup/get/all/jobtitles';
   return this.http.getFromGate(endpoint);
  }

  public getJobGrades(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/employee/hrmsetup/get/all/jobgrades';
   return this.http.getFromGate(endpoint);
  }

  public getDepartments(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/company/get/all/companystructures';
   return this.http.getFromGate(endpoint);
  }

  public getAllEmployees(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/employee/hrm/get/all/staffs';
   return this.http.getFromGate(endpoint);
  }

}

