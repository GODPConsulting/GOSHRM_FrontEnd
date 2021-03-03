import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  constructor(private apiService: ApiService) {}

  getAppraisalObjByManagerId(id: number) {
    return this.apiService.get(
      `/performance-appraisal/get/single/appraisal-objective/managerId?lineManagerId=${id}`
    );
  }
}
