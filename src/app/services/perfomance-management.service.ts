import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PerfomanceManagementService {
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
    console.log(err)
    return throwError(err)
  }
  addKPIndicator(payload: any) {
    return this.apiService.post("/performancesetup/add/update/kpi-indicator", payload);
  }
  getKpiCategory() {
    return this.apiService.get("/performancesetup/get/all/kpi-categories");
  }
  getKPIndicators() {
    return this.apiService.get("/performancesetup/get/all/kpi-indicators");
  }
  deleteKPIndicator(payload) {
    return this.apiService.post("/performancesetup/delete/kpi-indicator", payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadKPIndicators(payload: FormData){
    return this.apiService.post("/performancesetup/upload/kpi-indicator", payload)
  }
  downloadKPIndicators() {
    return this.apiService.getDownload("/performancesetup/download/kpi-indicators");
  }

  addGradeSetting(payload: any): Observable<any> {
    return this.apiService.post(`/performancesetup/add/update/grade-setting`, payload).pipe(tap(data => {
      return data
    }));
  }
  deleteGradeSetting(payload) {
    return this.apiService.post("/performancesetup/delete/grade-setting", payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getGradeSettings() {
    return this.apiService.get("/performancesetup/get/all/grade-settings");
  }
  
}
