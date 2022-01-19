import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LmsService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  
  getCompanyProfile(companyId): Observable<any> {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService.get(`/lms/companyInfo/get/all/companyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateCompanyProfile(payload) {
    return this.apiService.post("/lms/companyInfo/add/update/company", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSocialMediaUrls(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService.get(`/lms/socialmedia/get/all/socialmedia`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateSocialMediaUrls(payload) {
    return this.apiService.post("/lms/socialmedia/add/update/socialmedia", payload).pipe(
      tap(),
      map((res) => {
        return res.employeeList;
      }),
      catchError(this.handleError)
    );
  }

  getWebsiteUrls(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/website/get/all/websiteId`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateWebsiteUrls(payload) {
    return this.apiService.post("/lms/website/add/update/website", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllTraineeSetup() {
    return this.apiService.get("/lms/traineesetup/get/all/traineesetup").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllPayoutSetup(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/payoutsetup/get/all/payoutsetup`, params
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updatePayoutSetup(payload) {
    return this.apiService
      .post("/lms/payoutsetup/add/update/payoutsetup", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllEmailSetup(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/emailsetup/get/all/emailsetupId`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateEmailSetup(payload) {
    return this.apiService
      .post(`/lms/emailsetup/add/update/emailsetup`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPolicySetup(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/policysetup/get/all/policysetup`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateCompanyPolicy(payload) {
    return this.apiService.post("/lms/policysetup/add/update/policysetup", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSecuritySetup(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/securitysetup/get/all/securitysetup`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateSecuritySetup(payload) {
    return this.apiService.post("/lms/securitysetup/add/update/securitysetup", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

}
