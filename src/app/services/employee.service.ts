import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  allEmployeeUrl: string = "/admin/get/all/staff";
  singleEmployeeUrl: string = "/admin/get/single/staff/staffId?StaffId=";

  constructor(private apiService: ApiService) {}

  getEmployees() {
    return this.apiService.get(this.allEmployeeUrl);
  }

  getSingleEmployee(id: number) {
    return this.apiService.get(`${this.singleEmployeeUrl}${id}`);
  }
}
