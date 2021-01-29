import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  constructor(private apiService: ApiService) {}

  getData(url: string): Observable<any> {
    return this.apiService.get(url).pipe(
      tap((data) => {
        return data;
      })
    );
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
    return this.apiService.getExcel(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllHmos() {
    return this.apiService.get("/hrmsetup/get/all/hmos");
  }

  getAllJobGrades() {
    return this.apiService.get("/hrmsetup/get/all/jobgrades");
  }

  getAllProfCerts() {
    return this.apiService.get("/hrmsetup/get/all/prof_certification");
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
