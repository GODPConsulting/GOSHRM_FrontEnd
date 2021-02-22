import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";

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
}