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
  addEmmergencyContactUrl: string = "/hrm/add/update/employee/emergency_contact";
  getCountryUrl: string = "/common/countries";
  constructor(private apiService: ApiService) { }

  getEmployees() {
    return this.apiService.get(this.allEmployeeUrl);
  }

  getSingleEmployee(id: number) {
    return this.apiService.get(`${this.singleEmployeeUrl}${id}`);
  }

  addEmmergencyContact(payload) {
    return this.apiService.post("/hrm/add/update/employee/emergency_contact", payload).pipe((tap(data => {
      return data;
    })))
  }
  getCountry(){
    return this.apiService.get(this.getCountryUrl)
  }
  getSavedEmergencyContact(id){
    return this.apiService.get(`/hrm/get/single/employee/emergency_contact/Id?EmpId=${id}`);
  }
}
