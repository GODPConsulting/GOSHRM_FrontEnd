import { Injectable } from "@angular/core";
import { data } from "jquery";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RmsSetupService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  
  // Industry Services
  getAllIndustry(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/industry`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportIndustry(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/industry`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getIndustryById(
    IndustryId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('IndustryId', IndustryId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/industrybyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateIndustry(payload) {
    return this.apiService.post("/rmssetup/add/update/industry", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadIndustry(payload) {
    return this.apiService.post("/rmssetup/upload/industry", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteIndustry(payload) {
    return this.apiService.post("/rmssetup/delete/industry", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Specialzation Service
  getAllSpecialization(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/specialization`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportSpecialization(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/specialization`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSpecializationById(
    SpecializationId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('SpecializationId', SpecializationId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/specializationbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateSpecialization(payload) {
    return this.apiService.post("/rmssetup/add/update/specialization", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadSpecialization(payload) {
    return this.apiService.post("/rmssetup/upload/specialization", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteSpecialization(payload) {
    return this.apiService.post("/rmssetup/delete/specialization", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Location Services
  getAllLocation(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/location`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportLocation(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/location`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getLocationById(
    LocationId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('LocationId', LocationId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/locationbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateLocation(payload) {
    return this.apiService.post("/rmssetup/add/update/location", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadLocation(payload) {
    return this.apiService.post("/rmssetup/upload/location", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteLocation(payload) {
    return this.apiService.post("/rmssetup/delete/location", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Job Category
  getAllJobcategory(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/jobcategory`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportJobcategory(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/jobcategory`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getJobcategoryById(
    JobCategoryId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('JobCategoryId', JobCategoryId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/jobcategorybyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateJobcategory(payload) {
    return this.apiService.post("/rmssetup/add/update/jobcategory", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadJobcategory(payload) {
    return this.apiService.post("/rmssetup/upload/jobcategory", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteJobcategory(payload) {
    return this.apiService.post("/rmssetup/delete/jobcategory", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

   // Job Type Services
   getAllJobType(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/jobtype`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportJobType(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/jobtype`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getJobTypeById(
    jobtypeId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('JobTypeId', jobtypeId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/jobtypebyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdatejobtype(payload) {
    return this.apiService.post("/rmssetup/add/update/jobtype", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadJobType(payload) {
    return this.apiService.post("/rmssetup/upload/jobtype", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteJobType(payload) {
    return this.apiService.post("/rmssetup/delete/jobtype", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Experience Level Service
  getExperiencelevel(): Observable<any> {
    return this.apiService.get(`/rmssetup/get/all/experiencelevel`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  exportExperienceLevel(): Observable<any> {
    return this.apiService.get(`/rmssetup/export/experiencelevel`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getExperienceLevelById(
    ExperienceLevelId, SearchWord
  ): Observable<any> {
    const params = new HttpParams()
    .set('ExperienceLevelId', ExperienceLevelId)
    .set('SearchWord', SearchWord);
    return this.apiService.get(`/rmssetup/export/experiencelevelbyId`, params).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  addupdateExperienceLevel(payload) {
    return this.apiService.post("/rmssetup/add/update/experiencelevel", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  uploadExperienceLevel(payload) {
    return this.apiService.post("/rmssetup/upload/experiencelevel", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteExperienceLevel(payload) {
    return this.apiService.post("/rmssetup/delete/experiencelevel", payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

}
