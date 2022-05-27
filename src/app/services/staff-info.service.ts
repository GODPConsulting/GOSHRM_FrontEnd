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
export class StaffInfoService {
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


    getAllStaff() {
        return this.apiService.get("/admin/get/all/staff").pipe(
            map(data => {
                return data;
            })
        );
    }

    getSingleStaff(staffId) {
        return this.apiService
            .get(`/admin/get/single/staff/staffId?StaffId=${staffId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteStaff(staffId) {
        return this.apiService
            .delete(`/admin/delete-staff?staffId=${staffId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteMultipleStaff(body) {
        return this.apiService
            .post(`/admin/delete/staff/targetIds`, body)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    exportStaff() {
        return this.apiService.getExcel("/admin/generate/excel/staff").pipe(
            map(data => {
                return data;
            })
        );
    }


    uploadStaff(imageFile: File): Promise<any> {
        return this.apiService
            .uploadExcel("/admin/upload/excel/staff", imageFile)
            .then(
                data => {
                    return data;
                }
            );
    }

    addStaffInfo(body): Observable<any> {
        return this.apiService.post(`/admin/add/update/staff`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    resetProfile(userId: string):Observable<any> {
    return this.apiService.post(`/admin/reset/profile`, {userId}).pipe(tap(data => {
        return data;
    }))
    }
}
