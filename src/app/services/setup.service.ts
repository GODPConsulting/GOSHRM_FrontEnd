import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
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
    return this.apiService.getDownload(`/employee${url}`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getEmployeeIdFormat() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/identity-formats")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmployeeIdFormat(payload: any) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/identity-format", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteIdFormat(payload: object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/identity-format", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAcademicDisplines() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/academic/disciplines")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addAcademicDiscipline(payload: any) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/academic/discipline", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadAcademicDiscipline(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/academic/discipline", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteAcademicDiscipline(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/academic/discipline", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAcademicGrade() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/academic/grades")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addAcademicGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/academic/grade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadAcademicGrade(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/academic/grade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteAcademicGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/academic/grade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadAcademicGrade() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/academic/grades")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAcademicQualification() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/academic/qualifications")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addAcademicQualification(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/academic/qualification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadAcademicQualification(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/academic/qualification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteAcademicQualification(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/academic/qualification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadAcademicQualification() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/academic/qualifications")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getEmploymentLevel() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/emplpymentlevels")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmploymentLevel(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/employmentlevel", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadEmploymentLevel(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/employmentlevel", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteEmploymentLevel(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/employmentlevel", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getEmploymentType() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/employmenttypes")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmploymentType(payload: any) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/employmenttype", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadEmploymentType(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/employmenttype", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteEmploymentType(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/employmenttype", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getGymWorkout() {
    return this.apiService.get("/employee/hrmsetup/get/all/gymworkouts").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addGymWorkout(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/gymworkout", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadGymWorkout(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/gymworkout", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteGymWorkout(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/gymworkout", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHighSchoolGrade() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/highschoolgrades")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addHighSchoolGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/highschoolgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadHighSchoolGrade(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/highschoolgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteHighSchoolGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/highschoolgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHighSchoolSub() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/highschoolsubjects")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addHighSchoolSub(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/highschoolsubject", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadHighSchoolSub(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/highschoolsubject", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteHighSchoolSub(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/highschoolsubject", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHmo() {
    return this.apiService.get("/employee/hrmsetup/get/all/hmos").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addHmo(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/hmo", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadHmo(payload: FormData) {
    return this.apiService.post("/employee/hrmsetup/upload/hmo", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteHmo(payload: Object) {
    return this.apiService.post("/employee/hrmsetup/delete/hmo", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  downloadHmo() {
    return this.apiService.getDownload("/employee/hrmsetup/download/hmo").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getHospitalMgt() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/hospital-managements")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addHospitalMgt(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/hospital-management", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadHospitalMgt(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/hospital-management", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteHospitalMgt(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/hospital-management", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getJobGrades() {
    return this.apiService.get("/employee/hrmsetup/get/all/jobgrades").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addJobGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/jobgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadJobGrade(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/jobgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteJobGrade(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/jobgrade", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getSingleJobTitleById(id: number) {
    return this.apiService
      .get(`/employee/hrmsetup/get/single/jobtitle?SetupId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getJobTitle() {
    return this.apiService.get("/employee/hrmsetup/get/all/jobtitles").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addJobTitle(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/jobtitle", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadJobTitle(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/jobtitle", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteJobTitle(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/jobtitle", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getJobSkill() {
    return this.apiService.get("/employee/hrmsetup/get/all/job_skills").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addJobSkill(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/job_skill", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadJobSkill(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/job_skill", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteJobSkill(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/job_skill", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getLanguage() {
    return this.apiService.get("/employee/hrmsetup/get/all/languages").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addLanguage(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/language", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadLanguage(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/language", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteLanguage(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/language", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadLanguage() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/languages")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getLocation() {
    return this.apiService.get("/employee/hrmsetup/get/all/locations").pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addLocation(payload: any) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/location", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadLocation(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/location", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteLocation(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/location", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadLocation() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/locations")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getProfCerts() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/prof_certifications")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addProfCert(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/prof_certification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadProfCert(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/prof_certification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteProfCert(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/prof_certification", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  downloadProfCert() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/prof_certifications")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getProfMems() {
    return this.apiService
      .get("/employee/hrmsetup/get/all/prof_memberships")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addProfMem(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/add/update/prof_membership", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  uploadProfMem(payload: FormData) {
    return this.apiService
      .post("/employee/hrmsetup/upload/prof_membership", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteProfMem(payload: Object) {
    return this.apiService
      .post("/employee/hrmsetup/delete/prof_membership", payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadProfMem() {
    return this.apiService
      .getDownload("/employee/hrmsetup/download/prof_memberships")
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
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
