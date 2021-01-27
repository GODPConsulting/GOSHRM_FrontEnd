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
  deleteIdentificationUrl: string = "/hrm/delete/employee/identification";
  emergencyContactByStaffIdUrl: string =
    "/hrm/get/single/employee/emergency_contact/StaffId?StaffId=";
  addEmergencyContactUrl: string = "/hrm/add/update/employee/emergency_contact";
  addRefereeUrl: string = "/hrm/add/update/employee/referee";
  refereeByStaffIdUrl: string =
    "/hrm/get/single/employee/referee/staffId?StaffId=";
  hobbyByStaffIdUrl: string =
    "/hrm/get/single/employee/hobby/staffId?StaffId=";
  addHobbyUrl: string = "/hrm/add/update/employee/hobby";
  deleteHobbyUrl: string = "/hrm/delete/employee/hobby";

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

  deleteIdentification(payload) {
    return this.apiService.post(`${this.deleteIdentificationUrl}`, payload);
  }

  addEmmergencyContact(payload) {
    return this.apiService.post(this.addEmergencyContactUrl, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getEmergencyContactByStaffId(id: number) {
    return this.apiService.get(`${this.emergencyContactByStaffIdUrl}${id}`);
  }
  postReferee(payload: Object) {
    return this.apiService.post(`${this.addRefereeUrl}`, payload);
  }

  getRefereeByStaffId(id: number) {
    return this.apiService.get(`${this.refereeByStaffIdUrl}${id}`);
  }

  getHobbyByStaffId(id: number) {
    return this.apiService.get(`${this.hobbyByStaffIdUrl}${id}`);
  }

  postHobby(payload: Object) {
    return this.apiService.post(`${this.addHobbyUrl}`, payload);
  }

  deleteHobby(payload) {
    return this.apiService.post(`${this.deleteHobbyUrl}`, payload);
  }
}
