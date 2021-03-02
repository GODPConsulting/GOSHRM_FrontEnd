import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PerformanceManagementService {
  constructor(private apiService: ApiService) {}
  getkpiCategory() {
    return this.apiService.get("/performancesetup/get/all/kpi-categories");
  }

  postkpiCategory(payload: Object) {
    return this.apiService.post(
      "/performancesetup/add/update/kpi-category",
      payload
    );
  }

  deleteKpiCategory(payload: Object) {
    return this.apiService.post(
      "/performancesetup/delete/kpi-category",
      payload
    );
  }
  handleError(err) {
    console.log(err);
    return throwError(err);
  }
  addKPIndicator(payload: any) {
    return this.apiService.post(
      "/performancesetup/add/update/kpi-indicator",
      payload
    );
  }
  getKpiCategory() {
    return this.apiService.get("/performancesetup/get/all/kpi-categories");
  }
  getKPIndicators() {
    return this.apiService.get("/performancesetup/get/all/kpi-indicators");
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
    return this.apiService.post(
      "/performancesetup/upload/kpi-indicator",
      payload
    );
  }
  downloadKPIndicators() {
    return this.apiService.getDownload(
      "/performancesetup/download/kpi-indicators"
    );
  }

  addGradeSetting(payload: any): Observable<any> {
    return this.apiService
      .post(`/performancesetup/add/update/grade-setting`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteGradeSetting(payload) {
    return this.apiService
      .post("/performancesetup/delete/grade-setting", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getGradeSettings() {
    return this.apiService.get("/performancesetup/get/all/grade-settings");
  }

  getPointSettings() {
    return this.apiService.get("/performancesetup/get/all/point-settings");
  }

  postPointSettings(payload: Object) {
    return this.apiService.post(
      "/performancesetup/add/update/point-setting",
      payload
    );
  }

  deletePointSettings(payload: Object) {
    return this.apiService.post(
      "/performancesetup/delete/point-setting",
      payload
    );
  }

  getAppraisalCycles() {
    return this.apiService.get("/performancesetup/get/all/appraisal-circles");
  }

  postAppraisalCycle(payload: Object) {
    return this.apiService.post(
      "/performancesetup/add/update/appraisal-circle",
      payload
    );
  }

  deleteAppraisalCycle(payload: Object) {
    return this.apiService.post(
      "/performancesetup​/delete​/appraisal-circle",
      payload
    );
  }

  getKpiByKpiCategoryId(id: number) {
    return this.apiService.get(
      `/performancesetup/get/kpi-indicator/categoryId?categoryId=${id}`
    );
  }

  getKpiToJobGrades() {
    return this.apiService.get("/performancesetup/get/all/kpi-to-jobgrades");
  }

  getKpiToJobGradesWeightSumary() {
    return this.apiService.get(
      "/performancesetup/get/all/kpi-to-jobgrade-summary"
    );
  }

  postKpiToJobGrade(payload) {
    return this.apiService.post(
      "/performancesetup/add/update/kpi-to-jobgrade",
      payload
    );
  }

  deleteKpiToJobGrade(payload) {
    return this.apiService.post(
      "/performancesetup/delete/kpi-to-jobgrade",
      payload
    );
  }

  addAppraisalPreference(payload: any): Observable<any> {
    return this.apiService
      .post(`/performancesetup/add/update/appraisal-preference`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCompanies() {
    return this.apiService.get("/company/get/all/companystructures");
  }

  getAppraisalCycleByCompanyId(id) {
    return this.apiService.get(
      `/performancesetup/get/single/appraisal-circle/companyId?setupId=${id}`
    );
  }

  getAppraisalFeedbacks() {
    return this.apiService.get("/performancesetup/get/all/appraisal-feedbacks");
  }

  postAppraisalFeedback(payload: Object) {
    return this.apiService.post(
      "/performancesetup/add/update/appraisal-feedback",
      payload
    );
  }

  deleteAppraisalFeedback(payload: Object) {
    return this.apiService.post(
      "/performancesetup​/delete​/appraisal-feedback",
      payload
    );
  }

  getAppraisalObjectives() {
    return this.apiService.get(
      "/performance-appraisal/get/all/appraisal-objectives"
    );
  }
}
