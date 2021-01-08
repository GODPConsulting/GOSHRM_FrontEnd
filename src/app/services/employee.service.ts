import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private apiService: ApiService) {}

  getData(url: string): Observable<any> {
    return this.apiService.get(url).pipe(
      tap((data) => {
        return data;
      })
    );
  }
}
