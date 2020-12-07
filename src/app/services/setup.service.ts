import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  constructor(private apiService: ApiService) {}
  getHighSchoolSubject(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/highschoolsubjects`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  updateHighSchoolSubject(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/add/update/highschoolsubject`, payload)
      .pipe((res) => {
        return res;
      });
  }
  deleteHighSchoolSubject(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/delete/highschoolsubject`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // Employment Type
  getEmploymentTypeApi(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/employmenttypes`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  updateEmploymentType(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/add/update/employmenttype`, payload)
      .pipe((res) => {
        return res;
      });
  }

  deleteEmploymentType(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/delete/employmenttype`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getEmploymentLevel(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/emplpymentlevels`).pipe(tap(data => {
      return data;
    }))
  }

  deleteEmploymentLevel(payload):Observable<any> {
    return this.apiService.post(`/hrmsetup/delete/employmentlevel`, payload).pipe(tap(data => {
      return data;
    }))
  }


  updateEmploymentLevel(payload): Observable<any> {
    return this.apiService.post(`/hrmsetup/add/update/employmentlevel`, payload).pipe(res => {
      return res;
    })
  }
}
