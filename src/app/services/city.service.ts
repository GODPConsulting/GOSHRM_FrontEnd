import { ElementRef, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiService } from "./api.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { isInteger } from "lodash";
import { EmployeeService } from "./employee.service";
import { BehaviorSubject, Observable } from "rxjs";
import { JwtService } from "./jwt.service";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CityService {
  user = new BehaviorSubject<any>("");
  employee = this.user.asObservable();

  constructor(
    private apiService: ApiService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}
  getCurrentUser() {
    this.user.next(this.user);
  }
  sendToHr(
    card,
    firstName: string,
    lastName: string,
    email: string,
    userId: string
  ) {
    const payload = {
      subject: card,
      content: "Dear HR, your review is needed",
      toAddresses: [
        {
          name: "HR",
          address: "Emeka.Elo-Chukwuma@godp.com.ng",
        },
      ],
      fromAddresses: [
        {
          name: `${firstName} ${lastName}`,
          address: email,
        },
      ],
      sendIt: true,
      userIds: userId,
      identificationId: [""],
      module: 2,
      saveIt: true,
      template: 0,
      callBackUri: "",
    };
    return this.employeeService.postMailToHr(payload);
  }

  getAllCity() {
    return this.apiService.get("/city/allcity").pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteCity(cityId) {
    return this.apiService.delete(`/city/delete?cityId=${cityId}`).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateCity(body): Observable<any> {
    return this.apiService.post(`/city/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  multiDeleteCity(payload: Object): Observable<any> {
    return this.apiService.post(`/common/delete/cityById`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  exportCity(): Observable<any> {
    return this.apiService.getExcel(`/common/download/cities`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  uploadCity(File: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/city`, File)
      .then(data => {
        return data;
      });
  }
}
