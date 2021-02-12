import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  constructor(private apiService: ApiService) {}

  getData(url: string): Observable<any> {
    return this.apiService.get(url).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  updateData(url: string, payload: object): Observable<any> {
    return this.apiService.post(url, payload).pipe((res) => {
      return res;
    });
  }

  deleteData(url: string, payload: object): Observable<any> {
    return this.apiService.post(url, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  exportExcelFile(url: string) {
    return this.apiService.getDownload(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getEmployeeIdFormat() {
    return this.apiService.get("/hrmsetup/get/all/identity-formats");
  }

  addEmployeeIdFormat(payload: any) {
    return this.apiService.post(
      "/hrmsetup/add/update/identity-format",
      payload
    );
  }

  deleteIdFormat(payload: object) {
    return this.apiService.post("/hrmsetup/delete/identity-format", payload);
  }

  getAcademicDisplines() {
    return this.apiService.get("/hrmsetup/get/all/academic/disciplines");
  }

  addAcademicDiscipline(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/academic/discipline",
      payload
    );
  }

  uploadAcademicDiscipline(payload: FormData) {
    return this.apiService.post(
      "/hrmsetup/upload/academic/discipline",
      payload
    );
  }

  deleteAcademicDiscipline(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/delete/academic/discipline",
      payload
    );
  }

  getAcademicGrade() {
    return this.apiService.get("/hrmsetup/get/all/academic/grades");
  }

  addAcademicGrade(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/academic/grade", payload);
  }

  uploadAcademicGrade(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/academic/grade", payload);
  }

  deleteAcademicGrade(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/academic/grade", payload);
  }

  downloadAcademicGrade() {
    return this.apiService.getDownload("/hrmsetup/download/academic/grades");
  }

  getAcademicQualification() {
    return this.apiService.get("/hrmsetup/get/all/academic/qualifications");
  }

  addAcademicQualification(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/academic/qualification",
      payload
    );
  }

  uploadAcademicQualification(payload: FormData) {
    return this.apiService.post(
      "/hrmsetup/upload/academic/qualification",
      payload
    );
  }

  deleteAcademicQualification(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/delete/academic/qualification",
      payload
    );
  }

  downloadAcademicQualification() {
    return this.apiService.getDownload(
      "/hrmsetup/download/academic/qualifications"
    );
  }

  getEmploymentLevel() {
    return this.apiService.get("/hrmsetup/get/all/employmentlevels");
  }

  addEmploymentLevel(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/employmentlevel",
      payload
    );
  }

  uploadEmploymentLevel(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/employmentlevel", payload);
  }

  deleteEmploymentLevel(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/employmentlevel", payload);
  }

  getEmploymentType() {
    return this.apiService.get("/hrmsetup/get/all/employmenttypes");
  }

  addEmploymentType(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/employmenttype", payload);
  }

  uploadEmploymentType(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/employmenttype", payload);
  }

  deleteEmploymentType(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/employmenttype", payload);
  }

  getGymWorkout() {
    return this.apiService.get("/hrmsetup/get/all/gymworkouts");
  }

  addGymWorkout(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/gymworkout", payload);
  }

  uploadGymWorkout(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/gymworkout", payload);
  }

  deleteGymWorkout(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/gymworkout", payload);
  }

  getHighSchoolGrade() {
    return this.apiService.get("/hrmsetup/get/all/highschoolgrades");
  }

  addHighSchoolGrade(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/highschoolgrade",
      payload
    );
  }

  uploadHighSchoolGrade(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/highschoolgrade", payload);
  }

  deleteHighSchoolGrade(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/highschoolgrade", payload);
  }

  getHighSchoolSub() {
    return this.apiService.get("/hrmsetup/get/all/highschoolsubjects");
  }

  addHighSchoolSub(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/highschoolsubject",
      payload
    );
  }

  uploadHighSchoolSub(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/highschoolsubject", payload);
  }

  deleteHighSchoolSub(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/highschoolsubject", payload);
  }

  getHmo() {
    return this.apiService.get("/hrmsetup/get/all/hmos");
  }

  addHmo(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/hmo", payload);
  }

  uploadHmo(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/hmo", payload);
  }

  deleteHmo(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/hmo", payload);
  }

  downloadHmo() {
    return this.apiService.getDownload("/hrmsetup/download/hmo");
  }

  getHospitalMgt() {
    return this.apiService.get("/hrmsetup/get/all/hospital-managements");
  }

  addHospitalMgt(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/hospital-management",
      payload
    );
  }

  uploadHospitalMgt(payload: FormData) {
    return this.apiService.post(
      "/hrmsetup/upload/hospital-management",
      payload
    );
  }

  deleteHospitalMgt(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/delete/hospital-management",
      payload
    );
  }

  getJobGrades() {
    return this.apiService.get("/hrmsetup/get/all/jobgrades");
  }

  addJobGrade(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/jobgrade", payload);
  }

  uploadJobGrade(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/jobgrade", payload);
  }

  deleteJobGrade(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/jobgrade", payload);
  }

  getSingleJobTitleById(id: number) {
    return this.apiService.get(`/hrmsetup/get/single/jobtitle?SetupId=${id}`);
  }

  getJobTitle() {
    return this.apiService.get("/hrmsetup/get/all/jobtitles");
  }

  addJobTitle(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/jobtitle", payload);
  }

  uploadJobTitle(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/jobtitle", payload);
  }

  deleteJobTitle(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/jobtitle", payload);
  }

  getJobSkill() {
    return this.apiService.get("/hrmsetup/get/all/job_skills");
  }

  addJobSkill(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/job_skill", payload);
  }

  uploadJobSkill(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/job_skill", payload);
  }

  deleteJobSkill(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/job_skill", payload);
  }

  getLanguage() {
    return this.apiService.get("/hrmsetup/get/all/languages");
  }

  addLanguage(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/language", payload);
  }

  uploadLanguage(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/language", payload);
  }

  deleteLanguage(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/language", payload);
  }

  downloadLanguage() {
    return this.apiService.getDownload("/hrmsetup/download/languages");
  }

  getLocation() {
    return this.apiService.get("/hrmsetup/get/all/locations");
  }

  addLocation(payload: Object) {
    return this.apiService.post("/hrmsetup/add/update/location", payload);
  }

  uploadLocation(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/location", payload);
  }

  deleteLocation(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/location", payload);
  }

  downloadLocation() {
    return this.apiService.getDownload("/hrmsetup/download/locations");
  }

  getProfCerts() {
    return this.apiService.get("/hrmsetup/get/all/prof_certifications");
  }

  addProfCert(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/prof_certification",
      payload
    );
  }

  uploadProfCert(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/prof_certification", payload);
  }

  deleteProfCert(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/prof_certification", payload);
  }
  downloadProfCert() {
    return this.apiService.getDownload(
      "/hrmsetup/download/prof_certifications"
    );
  }

  getProfMems() {
    return this.apiService.get("/hrmsetup/get/all/prof_memberships");
  }

  addProfMem(payload: Object) {
    return this.apiService.post(
      "/hrmsetup/add/update/prof_membership",
      payload
    );
  }

  uploadProfMem(payload: FormData) {
    return this.apiService.post("/hrmsetup/upload/prof_membership", payload);
  }

  deleteProfMem(payload: Object) {
    return this.apiService.post("/hrmsetup/delete/prof_membership", payload);
  }

  downloadProfMem() {
    return this.apiService.getDownload("/hrmsetup/download/prof_memberships");
  }

  getStaffDepartments() {
    return this.apiService.get(`/company/get/all/companystructures`).pipe(tap(data => {
      return data;
    }))
  }
  /*  using xhr method
  upload(path: string, file: File): Promise<any> {
    return this.apiService.uploadExcel(path, file).then((data) => {
      return data;
    });
  } */

  /* no need updateData() will be used for upload
  upload(url, payload) {
    return this.apiService.post(url, payload).pipe((res) => {
      return res;
    });
  } */
}
