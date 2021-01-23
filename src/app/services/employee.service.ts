import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  allEmployeeUrl: string = "/admin/get/all/staff";
  EmployeeByIdUrl: string = "/admin/get/single/staff/staffId?StaffId=";
  identificationByStaffIdUrl: string =
    "/hrm/get/single/employee/identification/staffId?staffId=";
  addIdentificationUrl: string = "/hrm/add/update/employee/identification";
addEmmergencyContactUrl: string = "/hrm/add/update/employee/emergency_contact";
  getCountryUrl: string = "/common/countries";
  constructor(private apiService: ApiService) {}

  getEmployees() {
    return this.apiService.get(this.allEmployeeUrl);
  }

  getEmployeeById(id: number) {
    return this.apiService.get(`${this.EmployeeByIdUrl}${id}`);
  }

  getIdentificationByStaffId(id: number) {
    return this.apiService.get(`${this.identificationByStaffIdUrl}${id}`);
  }

  postIdentification(payload: Object) {
    return this.apiService.post(`${this.addIdentificationUrl}`, payload);
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
