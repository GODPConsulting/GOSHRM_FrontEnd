import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LmsService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  
  getCompanyProfile(companyId): Observable<any> {
    return this.apiService.get(`/api/v1/lms/companyInfo/get/all/${companyId}`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateCompanyProfile(payload) {
    return this.apiService.get("/api/v1/lms/companyInfo/add/update/company", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSocialMediaUrls() {
    return this.apiService.get(`/api/v1/lms/socialmedia/get/all/socialmedia`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateSocialMediaUrls(payload) {
    return this.apiService.put("/api/v1/lms/socialmedia/add/update/socialmedia", payload).pipe(
      tap(),
      map((res) => {
        return res.employeeList;
      }),
      catchError(this.handleError)
    );
  }

  getWebsiteUrls() {
    return this.apiService
      .get(`/api/v1/lms/website/get/all/websiteId`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateWebsiteUrls(payload) {
    return this.apiService
      .put(`​/api​/v1​/lms​/website​/add​/update​/website`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllTraineeSetup() {
    return this.apiService.get("/api/v1/lms/traineesetup/get/all/traineesetup").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllPayoutSetup(payoutId: number) {
    return this.apiService
      .get(`/api/v1/lms/payoutsetup/get/all/payoutsetup`
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
      .get("/api/v1/lms/payoutsetup/add/update/payoutsetup", payload)
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
      .get(`/api/v1/lms/emailsetup/add/update/emailsetup`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllEmailSetup(emailId: number) {
    return this.apiService
      .get(`/api/v1/lms/emailsetup/get/all/${emailId}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

}
