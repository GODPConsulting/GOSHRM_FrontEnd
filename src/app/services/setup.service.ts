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

<<<<<<< HEAD
  getEmploymentLevel(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/emplpymentlevels`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteEmploymentLevel(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/delete/employmentlevel`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updateEmploymentLevel(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/add/update/employmentlevel`, payload)
      .pipe((res) => {
        return res;
      });
  }

  // Job Grade Type
  retrievejobGrade(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/jobgrades`).pipe(
=======
  updateEmploymentLevel(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/add/update/employmentlevel`, payload)
      .pipe((res) => {
        return res;
      });
  }

  // HMO
  /*  getHmos(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/hmos`).pipe(
      tap((data) => {
        return data;
      })
    );
  } */

  getData(url) {
    return this.apiService.get(url).pipe(
>>>>>>> dev
      tap((data) => {
        return data;
      })
    );
  }

<<<<<<< HEAD
  updatejobGrade(payload): Observable<any> {
    return this.apiService
      .post(`/hrmsetup/add/update/jobgrade`, payload)
      .pipe((res) => {
        return res;
      });
  }

  deletejobGrade(payload): Observable<any> {
    return this.apiService.post(`/hrmsetup/delete/jobgrade`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
=======
  updateData(url, payload): Observable<any> {
    return this.apiService.post(url, payload).pipe((res) => {
      return res;
    });
>>>>>>> dev
  }

  deleteData(url, payload): Observable<any> {
    return this.apiService.post(url, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

}
