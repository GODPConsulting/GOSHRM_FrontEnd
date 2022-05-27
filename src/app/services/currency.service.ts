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
export class CurrencyService {
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

  getAllCurrency() {
    return this.apiService.get("/common/currencies").pipe(
      map(data => {
        return data;
      })
    );
  }

  getOperatingAccount() {
    return this.apiService
      .get(`/creditclassification/get/all/operating/account`)
      .pipe(
        map(data => {
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

  deleteCurrency(currencyId) {
    return this.apiService
      .delete(`/currency/delete?currencyId=${currencyId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  updateCurrency(body): Observable<any> {
    return this.apiService.post(`/currency/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateOperatingAccount(body): Observable<any> {
    return this.apiService
      .post(`/creditclassification/add/update/operating/account`, body)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  uploadCurrencies(File: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/currency`, File)
      .then(data => {
        return data;
      });
  }
  exportCurrencies(): Observable<any> {
    return this.apiService
      .getExcel(`/common/download/currencies`)
      .pipe(data => {
        return data;
      });
  }
}
