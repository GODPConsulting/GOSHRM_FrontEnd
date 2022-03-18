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
    return this.apiService.get(`/lms/company/getCompanyInfoById`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateCompanyProfile(payload) {
    return this.apiService.post("/lms/company/addAndUpdateCompanyInfo", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSocialMediaUrls(companyId, userId) {
    const params = new HttpParams()
    .set('companyId', companyId)
    .set('type', '1')
    .set('userId', userId);
    return this.apiService.get(`/lms/socialMedia/getAllSocialMedias`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateSocialMediaUrls(payload) {
    return this.apiService.post("/lms/socialMedia/addAndUpdateSocialMedia", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getWebsiteUrls(companyId, userId) {
    const params = new HttpParams()
    .set('companyId', companyId)
    .set('type', '1')
    .set('userId', userId);
    return this.apiService
      .get(`/lms/website/getWebsiteById`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateWebsiteUrls(payload) {
    return this.apiService.post("/lms/website/addAndUpdateWebsite", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllRunningCourses(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService.get("/lms/runningcourse/getAllRunningcourse", params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllPayoutSetup(companyId, userid) {
    const params = new HttpParams()
    .set('companyId', companyId)
    .set('type', '1')
    .set('userid', userid);
    return this.apiService
      .get(`/lms/payout/getAllPayOutSetup`, params
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
      .post("/lms/payout/addAndUpdatePayOutSetup", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deletePayoutSetup(payload) {
    return this.apiService
      .post("/lms/payoutsetup/deletePayoutsetup", payload)
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
      .get(`/lms/emailsetup/getAllEmailSetup`, params)
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
      .post(`/lms/emailsetup/addAndUpdateEmailSetup`, payload)
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
      .get(`/lms/privacy/getAllPolicySetup`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateCompanyPolicy(payload) {
    return this.apiService.post("/lms/privacy/addAndUpdatePolicySetup", payload).pipe(
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
      .get(`/lms/securitysetup/getAllSecuritysetup`, params)
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

  updatePageContent(payload) {
    return this.apiService.post("/lms/pagecontentsetup/addAndUpdatePageContentSetup", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteContent(payload) {
    return this.apiService.post(`/lms/pagecontentsetup/DeletePageContent`, payload).pipe(
      map(data => {
        return data;
      })
    );
  }

  uploadPageImage(payload): Observable<any> {
    return this.apiService.post(`/lms/pagecontentsetup/addAndUpdatePageImage`, payload).pipe(
      map(data => {
        return data;
      })
    );
  }

  getPageBanner(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/pagebannersetup/getPageBanner`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPageContent(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService
      .get(`/lms/pagecontentsetup/getAllPageContent`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getPageContentById(companyId, pageContentId) {
    const params = new HttpParams()
    .set('companyId', companyId)
    .set('pageContentId', pageContentId);
    return this.apiService
      .get(`/lms/pagecontentsetup/getPageContentById`, params)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updatePageBanner(payload) {
    return this.apiService.post("/lms/pagebannersetup/addAndUpdatePageBannerSetup", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllTrainers(companyId) {
    const params = new HttpParams()
    .set('companyId', companyId);
    return this.apiService.get("/lms/trainee/getAllTrainersProvider", params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateCompanyLogo(payload) {
    return this.apiService.post("/lms/company/addAndUpdateCompanyLogo", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

}
