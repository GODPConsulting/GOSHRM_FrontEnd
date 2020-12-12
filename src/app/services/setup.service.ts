import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  getProfMembership: any;
  updateProfMembership: any;
  deleteProfMembership: any;
  deleteLanguage: any;
  updateLanguage: any;
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
}
