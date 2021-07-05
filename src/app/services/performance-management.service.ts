import { id } from "./../../assets/all-modules-data/id";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import {
  AppraisalObjective,
  EmployeeKPI,
  IAppraisalCycle,
  IKpis,
  KpiCategory,
} from "../interface/interfaces";

@Injectable({
  providedIn: "root",
})
export class PerformanceManagementService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  getkpiCategory() {
    return this.apiService
      .get("/performance/performancesetup/get/all/kpi-categories")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  downloadKpiCategory() {
    return this.apiService
      .get(`/performance/performancesetup/download/kpi-categories`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  postkpiCategory(payload: Object) {
    return this.apiService
      .post("/performance/performancesetup/add/update/kpi-category", payload)
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
      .post("/performance/performancesetup/delete/kpi-category", payload)
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
      .post("/performance/performancesetup/add/update/kpi-indicator", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getKpiCategory(): Observable<KpiCategory[]> {
    return this.apiService
      .get("/performance/performancesetup/get/all/kpi-categories")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getKPIndicators(): Observable<IKpis> {
    return this.apiService
      .get("/performance/performancesetup/get/all/kpi-indicators")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  deleteKPIndicator(payload) {
    return this.apiService
      .post("/performance/performancesetup/delete/kpi-indicator", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadKPIndicators(payload: FormData) {
    return this.apiService
      .post("/performance/performancesetup/upload/kpi-indicator", payload)
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
      .getDownload("/performance/performancesetup/download/kpi-indicators")
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
      .post(`/performance/performancesetup/add/update/grade-setting`, payload)
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
      .post("/performance/performancesetup/delete/grade-setting", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getGradeSettings() {
    return this.apiService
      .get("/performance/performancesetup/get/all/grade-settings")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPointSettings() {
    return this.apiService
      .get("/performance/performancesetup/get/all/point-settings")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postPointSettings(payload: Object) {
    return this.apiService
      .post("/performance/performancesetup/add/update/point-setting", payload)
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
      .post("/performance/performancesetup/delete/point-setting", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalCycles() {
    //return this.apiService.get("/performance/performancesetup/get/all/appraisal-cycles").pipe(
    return this.apiService.get("/performance/get/all/appraisal_cycles").pipe(
      tap(),
      map((res) => {
        return res.list;
      }),
      catchError(this.handleError)
    );
  }

  postAppraisalCycle(payload: Object) {
    return this.apiService
      .post("/performance/create/update/appraisal_cycle", payload)
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
      .post("/performance/delete/appraisal_cycles", payload)
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
      .get(
        `/performance/performancesetup/get/kpi-indicator/categoryId?categoryId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getKpiToJobGrades(): Observable<any> {
    return this.apiService
      .get("/performance/performancesetup/get/all/kpi-to-jobgrades")
      .pipe(
        tap(),
        map((res) => {
          return res.setupList.map((item) => {
            return {
              jobGradeId: item.jobGradeId,
              jobGradeName: item.jobGradeName,
              kpiCategoryName: item.kpiCategoryName,
              weight: item.weight,
              kpiCategoryId: item.payloads
                .map((item) => item.kpiCategoryId)
                .toString(),
              kpis: item.payloads
                .map((item) => item.kpis)
                .map((kpi) => kpi.map((row) => row.kpiName))
                .toString(),
            };
          });
        }),
        catchError(this.handleError)
      );
  }

  getKpiToJobGradesWeightSumary() {
    return this.apiService
      .get("/performance/performancesetup/get/all/kpi-to-jobgrade-summary")
      .pipe(
        tap(),
        map((res) => {
          return res.setupList.filter(
            (value, index, self) =>
              self.map((item) => item.jobGradeId).indexOf(value.jobGradeId) ===
              index
          );
        }),
        catchError(this.handleError)
      );
  }

  postKpiToJobGrade(payload) {
    return this.apiService
      .post("/performance/performancesetup/add/update/kpi-to-jobgrade", payload)
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
      .post("/performance/performancesetup/delete/kpi-to-jobgrade", payload)
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
      .post(
        `/performance/performancesetup/add/update/appraisal-preference`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalCycleByCompanyId(id) {
    return this.apiService
      .get(`/performance/get/appraisal_cycles/bycompany?company=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalFeedbacks(employeeId: number) {
    return this.apiService
      .get(
        `/performance/get/all/employee/feedbacks/byemployeeId?EmployeeId=${employeeId}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalFeedbacksByStaffId(id) {
    return this.apiService.get(
      `/performance/performance-appraisal/get/single/appraisal-objective/staffId?staffId=${id}`
    );
  }

  postAppraisalFeedback(payload: Object) {
    return this.apiService
      .post(
        "/performance/performancesetup/add/update/appraisal-feedback",
        payload
      )
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
      .get("/performance/performancesetup/get/single/appraisal-cycle/status")
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
      .get(`/employee/hrm/get/single/employee/career/staffId?staffId=${id}`)
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
      .post(
        "/performance/performancesetup​/delete​/appraisal-feedback",
        payload
      )
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
        `/performance/performance-appraisal/get/single/appraisal-objective-kpis/staffId?staffId=${id}`
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
      .get("/performance/performance-appraisal/get/all/appraisal-objectives")
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
        `/performance/performance-appraisal/get/appraisal-objective/appraisalCycleId?appraisalCycleId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getEmployeeAppraisalCycle(
    employeeId: number,
    deptId: number,
    jobGradeId: number,
    appraisalCycleId: number = 0
  ): Observable<IAppraisalCycle[]> {
    return this.apiService
      .get(
        `/performance/get/employee_appraisal/cycle?JobGarde=${jobGradeId}&EmployeeId=${employeeId}&Department=${deptId}&AppraisalCycleId=${appraisalCycleId}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  addEmployeeKPI(payload: EmployeeKPI): Observable<EmployeeKPI> {
    return this.apiService
      .post(`/performance/add/new_kpi/by_employee`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAddableObjectives(jobGradeId: number): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee_can_add/kpis/by_jobgrade?jobgrade=${jobGradeId}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  getCannotAddObjectives(jobGradeId: number): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee_cannot_add/kpis/by_jobgrade?jobgrade=${jobGradeId}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  getEmployeeObjectives(id: number): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee_added/kpis/by_employeeId?EmployeeId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        })
      );
  }

  getEmployeeObjectiveDetails(
    jobGrade,
    employeeId,
    deptId,
    appraisalCycleId
  ): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee_obectves/by/employee_details?JobGarde=${jobGrade}&EmployeeId=${employeeId}&Department=${deptId}&AppraisalCycleId=${appraisalCycleId}`
      )
      .pipe(
        tap(),
        map((data) => {
          return data.list;
        }, catchError(this.handleError))
      );
  }

  startAppraisal(payload: AppraisalObjective): Observable<AppraisalObjective> {
    return this.apiService
      .post(`/performance/add/update/employee-appraisal/objectives`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  saveObjectives(employeeObjectiveId: number): Observable<any> {
    return this.apiService
      .post(`/performance/employee/confirm/objectives/by_objectivesId`, {
        employeeObjectiveId,
      })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getEmployeeObjectivesByLineManager(id: number): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee_objectives/by_line_mamager?longMangerId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res.list;
        }),
        catchError(this.handleError)
      );
  }

  getSingleEmployeeObjective(
    employeeId: number,
    appraisalCycleId: number
  ): Observable<AppraisalObjective> {
    return this.apiService
      .get(
        `/performance/get/single/employee_objectives?EmployeeId=${employeeId}&AppraisalCycleId=${appraisalCycleId}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res["list"];
        })
      );
  }

  // getAppraisalCycles():Observable<any> {
  //   return this.apiService.get(`/performance/get/all/appraisal_cycles`).pipe(tap(), map(res => {
  //     return res;
  //   }), catchError(this.handleError))
  // }

  addEmployeeComment(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-comment/by-employee`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmployeeScore(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-score/by-employee`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerOneComment(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-comment/by-reviewerone`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerOneScore(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-score/by-reviewerone`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerTwoComment(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-comment/by-reviewertwo`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerTwoScore(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-score/by-reviewertwo`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerThreeComment(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-comment/by-reviewerthree`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addReviewerThreeScore(payload): Observable<any> {
    return this.apiService
      .post(`/performance/add/feedback-score/by-reviewerthree`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAppraisalFeedback(
    employeedId: number,
    loggedInStaffId: number,
    appraisalCycleId: number
  ): Observable<any> {
    return this.apiService
      .get(
        `/performance/get/employee/feedbacks/byemployeeId?EmployeeId=${employeedId}&loggedInStaffId=${loggedInStaffId}&AppraisalCycleId=${appraisalCycleId}`
      )
      .pipe(
        tap(),
        map((data) => {
          return data.list;
        }),
        catchError(this.handleError)
      );
  }

  confirmByManager(employeeObjectiveId: number): Observable<any> {
    return this.apiService
      .post(`/performance/linemanager/confirm/objectives/by_objectivesId`, {
        employeeObjectiveId,
      })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  sendEmployeeFeedback(payload): Observable<any> {
    return this.apiService
      .post(`/performance/send/feedback/by-employee`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getAppraisalCycle(id: number): Observable<IAppraisalCycle> {
    return this.apiService
      .get(`/performance/get/single/appraisal_cycle?Id=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res.list[0];
        }),
        catchError(this.handleError)
      );
  }
}
