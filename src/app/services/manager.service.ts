import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  constructor(private apiService: ApiService) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
  getAppraisalObjByManagerId(id: number) {
    return this.apiService
      .get(
        `/performance-appraisal/get/single/appraisal-objective/managerId?lineManagerId=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
}
