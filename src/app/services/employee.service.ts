import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private apiService: ApiService) {}

  getEmployees() {
    return this.apiService.get("/admin/get/all/staff");
  }

  getEmployeeById(id: number) {
    return this.apiService.get(`/admin/get/single/staff/staffId?StaffId=${id}`);
  }

  getIdentificationByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/identification/staffId?staffId=${id}`
    );
  }

  postIdentification(payload: Object) {
    return this.apiService.post(
      "/hrm/add/update/employee/identification",
      payload
    );
  }

  deleteIdentification(payload) {
    return this.apiService.post("/hrm/delete/employee/identification", payload);
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
    return this.apiService.post("/hrm/add/update/employee/referee", payload);
  }

  getRefereeByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/referee/staffId?StaffId=${id}`
    );
  }

  deleteReferee(payload: Object) {
    return this.apiService.post("/hrm/delete/employee/referee", payload);
  }

  getHmoByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/hmo/staffId?StaffId=${id}`
    );
  }

  postHmo(payload: FormData) {
    return this.apiService.post("/hrm/add/update/employee/hmo", payload);
  }

  postHmoChangeRequest(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/hmo-request",
      payload
    );
  }

  deleteHmo(payload: object) {
    return this.apiService.post("/hrm/delete/employee/hmo", payload);
  }

  getProfCertByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/prof-certification/staffId?StaffId=${id}`
    );
  }

  postProfCert(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/prof-certification",
      payload
    );
  }

  deleteProfCert(payload: object) {
    return this.apiService.post(
      "/hrm/delete/employee/prof-certification",
      payload
    );
  }
}
