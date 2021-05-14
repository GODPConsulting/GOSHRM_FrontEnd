import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  getJobGrades(): Observable<any> {
    return this.apiService.get(`/hrmsetup/get/all/jobgrades`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCompanyStructures(): Observable<any> {
    return this.apiService.get(`/company/get/all/companystructures`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  getRoles(): Observable<any> {
    return this.apiService.get(`/admin/get/all/role`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCompanyStructureDefinition(): Observable<any> {
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
    return this.apiService.get(`/common/countries`).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getStatesByCountryId(id): Observable<any> {
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
}
