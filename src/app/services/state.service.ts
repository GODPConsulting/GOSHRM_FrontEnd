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
export class StateService {
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


  getAllState() {
    return this.apiService.get("/state/allstate").pipe(
        map(data => {
            return data;
        })
    );
}

getState(stateId) {
    return this.apiService
        .get(`/state/state?stateId=${stateId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

deleteState(stateId) {
    return this.apiService
        .delete(`/state/delete?stateId=${stateId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

updateState(body): Observable<any> {
    return this.apiService.post(`/state/update`, body).pipe(
        map(data => {
            return data;
        })
    );
}

exportStatesList() {
    return this.apiService.getExcel("/common/download/states").pipe(
        map(data => {
            return data;
        })
    );
}
multiDeleteStates(payload: Object):Observable<any> {
  return this.apiService.post(`/common/delete/stateId`, payload).pipe(tap(data => {
    return data;
  }))
}
}
