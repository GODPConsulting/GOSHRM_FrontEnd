import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RmsEducationalSetupService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  
  // Certification Services
  getAllCertification(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/certification`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportCertification(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/certification`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCertificationById(
    CertificationId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('CertificationId', CertificationId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/get/certificationbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateCertification(payload) {
    return this.apiService.post("/rmssetup/add/update/certification", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadCertification(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/rmssetup/upload/certification", File)
      .then(data => {
        return data;
      });
  }

  deleteCertification(payload) {
    return this.apiService.post("/rmssetup/delete/certification", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Professional Membership Service
  getAllProfessionalMembership(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/professionalmembership`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportProfessionalMembership(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/professionalmembership`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getProfessionalMembershipById(
    ProfessionalMembershipId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('ProfessionalMembershipId', ProfessionalMembershipId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/get/professionalmembershipbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateProfessionalMembership(payload) {
    return this.apiService.post("/rmssetup/add/update/professionalmembership", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadProfessionalMembership(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/rmssetup/upload/professionalmembership", File)
      .then(data => {
        return data;
      });
  }

  deleteProfessionalMembership(payload) {
    return this.apiService.post("/rmssetup/delete/professionalmembership", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Qualification Services
  getAllQualification(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/qualification`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportQualification(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/qualification`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getQualificationById(
    QualificationId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('QualificationId', QualificationId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/get/qualificationbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateQualification(payload) {
    return this.apiService.post("/rmssetup/add/update/qualification", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }


  uploadQualification(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/rmssetup/upload/qualification", File)
      .then(data => {
        return data;
      });
  }

  deleteQualification(payload) {
    return this.apiService.post("/rmssetup/delete/qualification", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Qualicication Grade
  getAllQualicicationGrade(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/qualificationgrade`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportQualicicationGrade(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/qualificationgrade`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getQualicicationGradeById(
    QualificationGradeId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('QualificationGradeId', QualificationGradeId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/get/qualificationgradebyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateQualicicationGrade(payload) {
    return this.apiService.post("/rmssetup/add/update/qualificationgrade", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadQualicicationGrade(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/rmssetup/upload/qualificationgrade", File)
      .then(data => {
        return data;
      });
  }

  deleteQualicicationGrade(payload) {
    return this.apiService.post("/rmssetup/delete/qualificationgrade", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

   // Language Services
   getAllLanguage(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/language`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportLanguage(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/language`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getLanguageById(
    LanguageId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('LanguageId', LanguageId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/get/languagebyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateLanguage(payload) {
    return this.apiService.post("/rmssetup/add/update/language", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadLanguage(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("rmssetup/upload/language", File)
      .then(data => {
        return data;
      });
  }

  deleteLanguage(payload) {
    return this.apiService.post("/rmssetup/delete/language", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

}
