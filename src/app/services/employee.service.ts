import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  allEmployeeUrl: string = "/admin/get/all/staff";
  EmployeeByIdUrl: string = "/admin/get/single/staff/staffId?StaffId=";
  identificationByStaffIdUrl: string ="/hrm/get/single/employee/identification/staffId?staffId=";
  addIdentificationUrl: string = "/hrm/add/update/employee/identification";
  deleteIdentificationUrl: string = "/hrm/delete/employee/identification";
  addRefereeUrl: string = "/hrm/add/update/employee/referee";
  refereeByStaffIdUrl: string ="/hrm/get/single/employee/referee/staffId?StaffId=";
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

  addEmergencyContact(payload) {
    return this.apiService.post("/hrm/add/update/employee/emergency_contact", payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
deleteEmergencyContact(payload){
  return this.apiService.post("/hrm/delete/employee/emergency_contact", payload).pipe(
    tap((data) => {
      return data;
    })
  );
}
  getEmergencyContactByStaffId(id: number) {
    return this.apiService.get(`/hrm/get/single/employee/emergency_contact/StaffId?StaffId=${id}`);
  }

  addLanguageRating(payload){
    return this.apiService.post("/hrm/add/update/employee/language" ,payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLanguages(){
    return this.apiService.get("/hrmsetup/get/all/languages");
  }

  deleteLanguageRating(payload){
    return this.apiService.post("/hrm/delete/employee/language",payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLanguageRatingByStaffId(id: number) {
    return this.apiService.get(`/hrm/get/single/employee/language/staffId?staffId=${id}`);
  }
  
  postReferee(payload: Object) {
    return this.apiService.post(`${this.addRefereeUrl}`, payload);
  }

  getRefereeByStaffId(id: number) {
    return this.apiService.get(`${this.refereeByStaffIdUrl}${id}`);
  }
}
