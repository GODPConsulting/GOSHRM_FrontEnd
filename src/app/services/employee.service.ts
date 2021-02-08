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
    return this.apiService.get("/hrm/get/all/staffs");
  }

  getEmployeeById(id: number) {
    //return this.apiService.get(`/admin/get/single/staff/staffId?StaffId=${id}`);
    return this.apiService.get(`/hrm/get/single/staff/Id?StaffId=${id}`);
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

  downloadIdentification(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/identification/Id?EmpId=${id}`
    );
  }

  addEmergencyContact(payload) {
    return this.apiService
      .post("/hrm/add/update/employee/emergency_contact", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteEmergencyContact(payload) {
    return this.apiService
      .post("/hrm/delete/employee/emergency_contact", payload)
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

  addLanguageRating(payload) {
    return this.apiService
      .post("/hrm/add/update/employee/language", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getLanguages() {
    return this.apiService.get("/hrmsetup/get/all/languages");
  }

  deleteLanguageRating(payload) {
    return this.apiService.post("/hrm/delete/employee/language", payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLanguageRatingByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/language/staffId?staffId=${id}`
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

  downloadReferee(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/referee/Id?EmpId=${id}`
    );
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

  downloadHmoRequest(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/hmo-request/Id?EmpId=${id}`
    );
  }

  getHospitalByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/hospital/staffId?StaffId=${id}`
    );
  }

  postHospital(payload: FormData) {
    return this.apiService.post("/hrm/add/update/employee/hospital", payload);
  }

  postHospitalChangeRequest(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/hospital-request",
      payload
    );
  }

  downloadHospitalRequest(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/hospital-request/Id?EmpId=${id}`
    );
  }

  deleteHospital(payload: object) {
    return this.apiService.post("/hrm/delete/employee/hospital", payload);
  }

  postBookHospitalMeeting(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/hospital-meeting",
      payload
    );
  }

  downloadHospitalMeeting(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/hospital-meeting/Id?EmpId=${id}`
    );
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

  downloadProfCert(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/prof-certification/Id?EmpId=${id}`
    );
  }

  addEmployeeQualification(payload: FormData, file: File): Promise<any> {
    return this.apiService
      .addCertificate("/hrm/add/update/employee/qualification", payload, file)
      .then((data) => {
        return data;
      });
  }

  getEmployeeQualificationByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/qualification/staffId?staffId=${id}`
    );
  }

  getGrades() {
    return this.apiService.get("/hrmsetup/get/all/academic/grades");
  }

  deleteEmployeeQualification(payload) {
    return this.apiService
      .post("/hrm/delete/employee/qualification", payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getHobbyByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/hobby/staffId?StaffId=${id}`
    );
  }

  postHobby(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/hobby", payload);
  }

  deleteHobby(payload) {
    return this.apiService.post("/hrm/delete/employee/hobby", payload);
  }

  getAssetByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/asset/staffId?StaffId=${id}`
    );
  }

  postAsset(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/asset", payload);
  }

  deleteAsset(payload) {
    return this.apiService.post("/hrm/delete/employee/asset", payload);
  }

  getDependentContactByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/dependent_contact/staffId?StaffId=${id}`
    );
  }

  postDependentContact(payload: Object) {
    return this.apiService.post(
      "/hrm/add/update/employee/dependent_contact",
      payload
    );
  }

  deleteDependentContact(payload) {
    return this.apiService.post(
      "/hrm/delete/employee/dependent_contact",
      payload
    );
  }

  getCareerByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/career/staffId?StaffId=${id}`
    );
  }

  postCareer(payload: Object) {
    return this.apiService.post("/hrm/add/update/employee/career", payload);
  }

  deleteCareer(payload) {
    return this.apiService.post("/hrm/delete/employee/career", payload);
  }
  //Employee Skills
  getSkillByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/skill/staffId?StaffId=${id}`
    );
  }

  addSkill(payload: Object) {
    return this.apiService.post(`/hrm/add/update/employee/skill`, payload);
  }

  deleteSkills(payload) {
    return this.apiService.post(`/hrm/delete/employee/skill`, payload);
  }

  downloadEmployeeSkill(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/skill/Id?EmpId=${id}`
    );
  }

  getGymByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/gym/staffId?StaffId=${id}`
    );
  }

  postGym(payload: FormData) {
    return this.apiService.post("/hrm/add/update/employee/gym", payload);
  }

  postGymChangeRequest(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/gym-request",
      payload
    );
  }

  downloadGymRequest(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/gym-request/Id?EmpId=${id}`
    );
  }

  deleteGym(payload: object) {
    return this.apiService.post("/hrm/delete/employee/gym", payload);
  }

  postBookGymMeeting(payload: FormData) {
    return this.apiService.post(
      "/hrm/add/update/employee/gym-meeting",
      payload
    );
  }

  downloadGymMeeting(id: number) {
    return this.apiService.getDownload(
      `/hrm/download/employee/gym-meeting/Id?EmpId=${id}`
    );
  }
}
