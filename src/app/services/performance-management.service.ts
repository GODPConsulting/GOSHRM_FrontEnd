import { id } from "./../../assets/all-modules-data/id";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PerformanceManagementService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
  getkpiCategory() {
    return this.apiService.get("/performancesetup/get/all/kpi-categories").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postkpiCategory(payload: Object) {
    return this.apiService
      .post("/performancesetup/add/update/kpi-category", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteKpiCategory(payload: Object) {
    return this.apiService
      .post("/performancesetup/delete/kpi-category", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  addKPIndicator(payload: any) {
    return this.apiService
      .post("/performancesetup/add/update/kpi-indicator", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getKpiCategory() {
    return this.apiService.get("/performancesetup/get/all/kpi-categories").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  getKPIndicators() {
    return this.apiService.get("/performancesetup/get/all/kpi-indicators").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  deleteKPIndicator(payload) {
    return this.apiService
      .post("/performancesetup/delete/kpi-indicator", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadKPIndicators(payload: FormData) {
    return this.apiService
      .post("/performancesetup/upload/kpi-indicator", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  downloadKPIndicators() {
    return this.apiService
      .getDownload("/performancesetup/download/kpi-indicators")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addGradeSetting(payload: any): Observable<any> {
    return this.apiService
      .post(`/performancesetup/add/update/grade-setting`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  deleteGradeSetting(payload) {
    return this.apiService
      .post("/performancesetup/delete/grade-setting", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getGradeSettings() {
    return this.apiService.get("/performancesetup/get/all/grade-settings").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getPointSettings() {
    return this.apiService.get("/performancesetup/get/all/point-settings").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postPointSettings(payload: Object) {
    return this.apiService
      .post("/performancesetup/add/update/point-setting", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deletePointSettings(payload: Object) {
    return this.apiService
      .post("/performancesetup/delete/point-setting", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalCycles() {
    return this.apiService
      .get("/performancesetup/get/all/appraisal-cycles")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postAppraisalCycle(payload: Object) {
    return this.apiService
      .post("/performancesetup/add/update/appraisal-cycle", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteAppraisalCycle(payload: any) {
    return this.apiService
      .post("/performancesetup​/delete​/appraisal-cycle", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getKpiByKpiCategoryId(id: number) {
    return this.apiService
      .get(`/performancesetup/get/kpi-indicator/categoryId?categoryId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getKpiToJobGrades() {
    return this.apiService
      .get("/performancesetup/get/all/kpi-to-jobgrades")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getKpiToJobGradesWeightSumary() {
    return this.apiService
      .get("/performancesetup/get/all/kpi-to-jobgrade-summary")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postKpiToJobGrade(payload) {
    return this.apiService
      .post("/performancesetup/add/update/kpi-to-jobgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteKpiToJobGrade(payload) {
    return this.apiService
      .post("/performancesetup/delete/kpi-to-jobgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addAppraisalPreference(payload: any): Observable<any> {
    return this.apiService
      .post(`/performancesetup/add/update/appraisal-preference`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getCompanies() {
    return this.apiService.get("/company/get/all/companystructures").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAppraisalCycleByCompanyId(id) {
    return this.apiService
      .get(
        `/performancesetup/get/single/appraisal-cycle/companyId?setupId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalFeedbacks(id) {
    return this.apiService
      .get(
        `/performance-appraisal/get/single/appraisal-objective/staffId?staffId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalFeedbacksByStaffId(id) {
    return this.apiService.get(
      `/performance-appraisal/get/single/appraisal-objective/staffId?staffId=${id}`
    );
  }

  postAppraisalFeedback(payload: Object) {
    return this.apiService
      .post("/performancesetup/add/update/appraisal-feedback", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getAppraisalCycleByStatus() {
    return this.apiService
      .get("/performancesetup/get/single/appraisal-cycle/status")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getCareerByStaffId(id) {
    return this.apiService
      .get(`/hrm/get/single/employee/career/staffId?staffId=${id}`)
      .pipe(
        tap(),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteAppraisalFeedback(payload: Object) {
    return this.apiService
      .post("/performancesetup​/delete​/appraisal-feedback", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getAppraisalObjectives(id) {
    return this.apiService
      .get(
        `/performance-appraisal/get/single/appraisal-objective-kpis/staffId?staffId=${id}`
      )
      .pipe(
        tap(),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getAllAppraisalObjectives() {
    return this.apiService
      .get("/performance-appraisal/get/all/appraisal-objectives")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalsByCycleId(id: number) {
    return this.apiService
      .get(
        `/performance-appraisal/get/appraisal-objective/appraisalCycleId?appraisalCycleId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
}
