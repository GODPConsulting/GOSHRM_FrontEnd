import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
  postMailToHr(payload) {
    return this.apiService.post('/email/send/emails', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEmailById(id: number) {
    return this.apiService.get(`/email/get/single/email?EmailId=${id}`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEmployees() {
    return this.apiService.get('/hrm/get/all/staffs').pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEmployeeById(id: number) {
    return this.apiService.get(`/hrm/get/single/staff/Id?StaffId=${id}`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEmployeeByEmail(email: string) {
    return this.apiService
      .get(`/hrm/get/single/staff/email?email=${email}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  multiUploadEmployeePhotos() {
    return this.apiService.post('/hrm/upload/multi-image').pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getIdentificationByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/identification/staffId?staffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postIdentificationId(payload: any) {
    return this.apiService
      .post('/hrm/add/update/employee/identification', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteIdentification(payload) {
    return this.apiService
      .post('/hrm/delete/employee/identification', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadIdentification(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/identification/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmergencyContact(payload) {
    return this.apiService
      .post('/hrm/add/update/employee/emergency_contact', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  deleteEmergencyContact(payload) {
    return this.apiService
      .post('/hrm/delete/employee/emergency_contact', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getEmergencyContactByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/emergency_contact/StaffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addLanguageRating(payload) {
    return this.apiService
      .post('/hrm/add/update/employee/language', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getLanguages() {
    return this.apiService.get('/hrmsetup/get/all/languages').pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteLanguageRating(payload) {
    return this.apiService.post('/hrm/delete/employee/language', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getLanguageRatingByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/language/staffId?staffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postReferee(payload: any) {
    return this.apiService
      .post('/hrm/add/update/employee/referee', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRefereeByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/referee/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteReferee(payload: any) {
    return this.apiService.post('/hrm/delete/employee/referee', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  downloadReferee(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/referee/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHmoByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/hmo/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postHmo(payload: FormData) {
    return this.apiService.post('/hrm/add/update/employee/hmo', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postHmoChangeRequest(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/hmo-request', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteHmo(payload: any) {
    return this.apiService.post('/hrm/delete/employee/hmo', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  downloadHmoRequest(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/hmo-request/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHospitalByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/hospital/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postHospital(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/hospital', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postHospitalChangeRequest(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/hospital-request', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadHospitalRequest(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/hospital-request/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteHospital(payload: any) {
    return this.apiService.post('/hrm/delete/employee/hospital', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postBookHospitalMeeting(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/hospital-meeting', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadHospitalMeeting(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/hospital-meeting/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getProfCertByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/prof-certification/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postProfCert(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/prof-certification', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteProfCert(payload: object) {
    return this.apiService
      .post('/hrm/delete/employee/prof-certification', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadProfCert(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/prof-certification/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addEmployeeQualification(payload: FormData, file: File): Promise<any> {
    return this.apiService
      .addCertificate('/hrm/add/update/employee/qualification', payload, file)
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
    return this.apiService.get('/hrmsetup/get/all/academic/grades');
  }

  deleteEmployeeQualification(payload) {
    return this.apiService
      .post('/hrm/delete/employee/qualification', payload)
      .pipe(tap())
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHobbyByStaffId(id: number) {
    return this.apiService.get(
      `/hrm/get/single/employee/hobby/staffId?StaffId=${id}`
    );
  }

  postHobby(payload: any) {
    return this.apiService.post('/hrm/add/update/employee/hobby', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteHobby(payload) {
    return this.apiService.post('/hrm/delete/employee/hobby', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAssetByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/asset/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postAsset(payload: any) {
    return this.apiService.post('/hrm/add/update/employee/asset', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteAsset(payload) {
    return this.apiService.post('/hrm/delete/employee/asset', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getDependentContactByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/dependent_contact/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postDependentContact(payload: any) {
    return this.apiService
      .post('/hrm/add/update/employee/dependent_contact', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteDependentContact(payload) {
    return this.apiService
      .post('/hrm/delete/employee/dependent_contact', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCareerByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/career/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postCareer(payload: any) {
    return this.apiService
      .post('/hrm/add/update/employee/career', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteCareer(payload) {
    return this.apiService.post('/hrm/delete/employee/career', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  // Employee Skills
  getSkillByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/skill/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addSkill(payload: any) {
    return this.apiService.post(`/hrm/add/update/employee/skill`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteSkills(payload) {
    return this.apiService.post(`/hrm/delete/employee/skill`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  downloadEmployeeSkill(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/skill/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getGymByStaffId(id: number) {
    return this.apiService
      .get(`/hrm/get/single/employee/gym/staffId?StaffId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postGym(payload: FormData) {
    return this.apiService.post('/hrm/add/update/employee/gym', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postGymChangeRequest(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/gym-request', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadGymRequest(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/gym-request/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteGym(payload: any) {
    return this.apiService.post('/hrm/delete/employee/gym', payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postBookGymMeeting(payload: FormData) {
    return this.apiService
      .post('/hrm/add/update/employee/gym-meeting', payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  downloadGymMeeting(id: number) {
    return this.apiService
      .getDownload(`/hrm/download/employee/gym-meeting/Id?EmpId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllEmails() {
    return this.apiService.get('/email/get/all/useremails?Module=2').pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
}
