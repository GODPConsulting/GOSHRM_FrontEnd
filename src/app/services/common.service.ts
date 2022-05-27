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

  getAllModules() {
    return this.apiService.get("/common/modules").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getJobTitles(): Observable<any> {
    return this.apiService.get(`/common/jobTitles`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getJobTitleById(jobTitleId: any): Observable<any> {
    return this.apiService
      .get(`/common/get/get/single/jobTitleById?JobTitleId=${jobTitleId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllCountry (): Observable<any> {
    return this.apiService.get("/common/countries").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getStateByCountry(id: number): Observable<any> {
    return this.apiService
      .get(`/common/get/states/countryId?CountryId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCountry(countryId) {
    return this.apiService
      .get(`/common/get/single/countryById?CountryId=${countryId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateCountry(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/country`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteMultipleCountry(body): Observable<any> {
    return this.apiService.post(`/common/delete/countryById`, body).pipe(
      tap(data => {
        return data;
        // console.log("tttt", data);
      })
    );
  }

  exportCountryList() {
    return this.apiService.getExcel("/common/download/countries").pipe(
      map(data => {
        return data;
      })
    );
  }

  uploadCountryList(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/common/upload/countries", File)
      .then(data => {
        return data;
      });
  }

  getAllState() {
    return this.apiService.get("/common/states").pipe(
      tap(data => {
        return data;
      })
    );
  }
  getState(stateId) {
    return this.apiService
      .get(`/common/get/single/stateById?StateId=${stateId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // update state
  updateState(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/state`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  uploadStatesList(File: File): Promise<any> {
    return this.apiService
      .uploadExcel("/common/upload/states", File)
      .then(data => {
        return data;
      });
  }

  getAllCity(): Observable<any> {
    return this.apiService.get("/common/cities").pipe(
      tap(data => {
        return data;
      })
    );
  }

  // update city
  updateCity(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/city`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getCity(cityId) {
    return this.apiService
      .get(`/common/get/get/single/cityById?CityId=${cityId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getCityByStateId(id): Observable<any> {
    return this.apiService.get(`/common/get/cities/stateId?StateId=${id}`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getCitiesByState(id: number): Observable<any> {
    return this.apiService.get(``).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getAllDirectorType() {
    return this.apiService.get("/common/directorTypes").pipe(
      tap(data => {
        return data;
      })
    );
  }

  // update document type
  updateDocumenttype(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/add/update/documentType`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllDocumentType() {
    return this.apiService.get("/common/documentypes").pipe(
      tap(data => {
        return data;
      })
    );
  }
  exportDocumentType(): Observable<any> {
    return this.apiService.get(`/common/download/documenttype`).pipe(tap(data => {
      return data;
    }))
  }
  uploadDocumentType(file: File): Promise<any> {
    return this.apiService.uploadExcel(`/common/upload/documenttype`, file).then(data => {
      return data;
    })
  }
  multiDeleteDocumentType(payload: Object): Observable<any> {
    return this.apiService.post(`/common/delete/documentTypeById`, payload).pipe(tap(data => {
      return data;
    }))
  }
  getAllCurrency(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:90/common/currencies`).pipe(
    return this.apiService.get(`/common/currencies`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getCurrency(currencyId) {
    return this.apiService
      .get(`/common/get/single/currencyById?CurrencyId=${currencyId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getCurrencyRate(currencyId) {
    return this.apiService
      .get(`/common/currencyRates/currencyId?CurrencyId=${currencyId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  updateCurrency(payload: any): Observable<any> {
    return this.apiService.post(`/common/add/update/currency`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  multipleDeleteCurrency(payload: Object): Observable<any> {
    return this.apiService.post(`/common/delete/currencyById`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllPaymentSetups(): Observable<any> {
    return this.apiService
      .get(`/employee/hrmsetup/get/all/payment-setup`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  addPaymentSetup(payload: Object): Observable<any> {
    return this.apiService.post(`/employee/hrmsetup/add/update/payment-setup`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
}
