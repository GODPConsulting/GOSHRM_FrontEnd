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

  getData(url) {
    return this.apiService.get(url).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  updateData(url, payload): Observable<any> {
    return this.apiService.post(url, payload).pipe((res) => {
      return res;
    });
  }

  deleteData(url, payload): Observable<any> {
    return this.apiService.post(url, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
}
