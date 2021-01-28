import { Injectable } from "@angular/core";
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

  addEmmergencyContact(payload) {
    return this.apiService
      .post("/hrm/add/update/employee/emergency_contact", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getEmergencyContactByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/emergency_contact/StaffId?StaffId=${id}`
    );
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

  getHobbyByStaffId(id: number) {
    return this.apiService.get(`/hrm/get/single/employee/hobby/staffId?StaffId=${id}`);
  }

  postHobby(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/hobby", payload);
  }

  deleteHobby(payload) {
    return this.apiService.post("/hrm/delete/employee/hobby", payload);
  }

  getAssetByStaffId(id: number) {
    return this.apiService.get(`/hrm/get/single/employee/asset/staffId?StaffId=${id}`);
  }

  postAsset(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/asset", payload);
  }

  deleteAsset(payload) {
    return this.apiService.post("/hrm/delete/employee/asset", payload);
  }

  getDependentContactByStaffId(id: number) {
    return this.apiService.get(`/hrm/get/single/employee/dependent_contact/staffId?StaffId=${id}`);
  }

  postDependentContact(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/dependent_contactt", payload);
  }

  deleteDependentContact(payload) {
    return this.apiService.post("/hrm/delete/employee/dependent_contact", payload);
  }
}
