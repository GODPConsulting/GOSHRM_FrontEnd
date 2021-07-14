import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  getJobGrades(): Observable<any> {
    return this.apiService.get(`/employee/hrmsetup/get/all/jobgrades`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCompanyStructures(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/company/get/all/companystructures`).pipe(tap(),
    return this.apiService.get(`/company/get/all/companystructures`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  getRoles(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/admin/get/all/role`).pipe(tap(),
    return this.apiService.get(`/admin/get/all/role`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCompanyStructureDefinition(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/company/get/all/companystructureDefinition`).pipe(tap(),
    return this.apiService
      .get(`/company/get/all/companystructureDefinition`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getAccessLevelsByAccessLevelId(id): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/company/get/all/companystructure/accessId?AccessId=${id}`).pipe(tap(),
    return this.apiService
      .get(`/company/get/all/companystructure/accessId?AccessId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getIdentifications(): Observable<any> {
    return this.apiService.get(`/common/identifications`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCountries(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/common/countries`).pipe(tap(),
    return this.apiService.get(`/common/countries`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getStatesByCountryId(id): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/common/get/states/countryId?CountryId=${id}`).pipe(tap(),
    return this.apiService
      .get(`/common/get/states/countryId?CountryId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getCompanies(staffId: number): Observable<any> {
    return this.apiService
      .get(`/company/get/companystructure/staffId?StaffId=${staffId}`)
      .pipe(
        tap(),
        map((res) => {
          return res.companyStructures;
        })
      );
  }
}
