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
export class MailConfigService {
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

  getMailConfigs():Observable<any> {
    return this.apiService.get(`/email/get/all/emailconfig`).pipe(tap(data => {
      return data;
    }))
  }
  updateMailConfig(payload: Object):Observable<any> {
    return this.apiService.post(`/email/add/update/emailconfig`, payload).pipe(tap(data => {
      return data
    }))
  }
  getMailConfig(id: number):Observable<any> {
    return this.apiService.get(`/email/get/single/emailconfig?EmailConfigId=${id}`).pipe(tap(data => {
      return data;
    }))
  }
  deleteMailConfig(id: any):Observable<any> {
    return this.apiService.post(`/email/delete/emailconfig/targetIds`, id).pipe(tap(data => {
      return data;
    }))
  }
  
}
