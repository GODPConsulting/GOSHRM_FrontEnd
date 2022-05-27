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
export class UtilitiesService {
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

  // Date validation with the datepicker package
  setMinMaxDate(form: FormGroup, startDate: string, endDate: string) {
    let dateSetter: any = {};
    if (form.get(startDate).value) {
      dateSetter.minDate = new Date(form.get(startDate).value);
    }
    if (form.get(endDate).value) {
      dateSetter.maxDate = new Date(form.get(endDate).value);
    }
    return dateSetter;
  }

  // Validates the file to be uploaded
  uploadFileValidator(
    event: Event,
    form: FormGroup,
    staffId?: number | string
  ) {
    const file = (<HTMLInputElement>event.target).files[0];
    if (!file) {
      return swal.fire("GOSHRM", "Please select a valid file format", "error");
    }

    // Acceptable excel formats
    const excelTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    // Checks if the file type is same as any of the accpetable excel formats
    const isExcelFile = excelTypes.some((str) => file.type.includes(str));

    // If upload is from employee page and is not an image or pdf
    if (
      isInteger(staffId) &&
      !file.type.includes("image") &&
      file.type !== "application/pdf"
    ) {
      swal.fire(
        "GOSHRM",
        "Please select a valid file of formats jpg, png or pdf",
        "error"
      );
      (<HTMLInputElement>event.target).value = "";
    } else if (!staffId && !file.type.includes("image")) {
      swal.fire("GOSHRM", "Please select a valid image file format", "error");
      (<HTMLInputElement>event.target).value = "";
    } else if (staffId === "hr" && !isExcelFile) {
      // If upload is not from employee page and not excel file
      swal.fire(
        "GOSHRM",
        "Please select a valid file of excel(.xls or .xlsx) format",
        "error"
      );
      (<HTMLInputElement>event.target).value = "";
    } else {
      // Appends a selected file to the form property
      form.patchValue({
        [(<HTMLInputElement>event.target).name]: file,
      });
      return "file valid";
    }
  }

  deleteArray(event: Event, id: number, idsArray: any[]) {
    if ((<HTMLInputElement>event.target).checked) {
      if (!idsArray.includes(id)) {
        idsArray.push(id);
      }
    } else {
      idsArray.splice(idsArray.indexOf(id), 1);
      /*  idsArray = idsArray.filter((_id) => {
        return _id !== id;
      });*/
    }
  }

  checkAllBoxes(event: Event, dataArray: any[]) {
    if ((<HTMLInputElement>event.target).checked) {
      return dataArray.map((item) => item.id | item.emailMessageId);
    }
    return [];
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    if ((<HTMLInputElement>event.target).checked) {
      form.get(formControlName).setValue("Present");
    } else {
      form.get(formControlName).setValue("");
    }
  }

  getCountryById(id: number) {
    return this.apiService.get(
      `/common/get/single/countryById?CountryId=${id}`
    );
  }

  getStateById(id: number) {
    return this.apiService.get(`common/get/single/stateById?StateId=${id}`);
  }

  // Converts response to file and downloads it
  byteToFile(data: string, fileName: string, mimeType?: BlobPropertyBag) {
    if (data != undefined) {
      const byteString = atob(data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const bb = new Blob([ab]);
      try {
        const file = new File([bb], fileName, mimeType);
        // window.navigator.msSaveBlob(file, fileName);
        saveAs(file);
      } catch (err) {
        const textFileAsBlob = new Blob([bb], mimeType);
        window.navigator.msSaveBlob(textFileAsBlob, fileName);
      }
    } else {
      return swal.fire(`GOS HRM`, "Unable to download data", "error");
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Date validation with the TypeScript
  // validateDate(
  //   form: FormGroup,
  //   startDate: string,
  //   endDate: string,
  //   startDateName: string,
  //   endDateName: string
  // ) {
  //   let date1: number, date2: number;
  //   if (form.get(startDate).value) {
  //     date1 = new Date(form.get(startDate).value).getTime();
  //   }
  //   if (form.get(endDate).value) {
  //     date2 = new Date(form.get(endDate).value).getTime();
  //     // endDate becomes NaN when 'present'..new Date('present').getTime() == NaN
  //     if (isNaN(date2)) {
  //       date2 = new Date().getTime();
  //     }
  //   }
  //   if (date1 > date2) {
  //     swal.fire(
  //       "GOSHRM",
  //       `${startDateName} cannot be later than ${endDateName}`,
  //       "error"
  //     );
  //     //form.get(startDate).setErrors({ invalid: true });
  //     //form.get(endDate).setErrors({ invalid: true });
  //     form.get(startDate).setValue("");
  //     form.get(endDate).setValue("");
  //   } else {
  //     /* form.get(startDate).setErrors(null);
  //     form.get(endDate).setErrors(null); */
  //   }
  // }
  // Date validation with the TypeScript

  showMessage(response: any, type: string) {
    const message = response.status.message.friendlyMessage;
    switch (type) {
      case "success":
        return swal.fire("GOSHRM", message, "success");
      case "error":
        return swal.fire("GOSHRM", message, "error");
    }
    // if (type === 'success') {
    //   swal.fire('GOSHRM', message, 'success')
    // } else {
    //
    // }
  }
  showError(msg: string) {
    return swal.fire("GOSHRM", msg, "error");
  }

  createYears(from, to) {
    const years = [];
    for (let i = from; i <= to; i++) {
      return years.push({ year: i });
    }
  }

  confirmDelete() {
    return swal.fire({
      title: "Are you sure you want to delete this record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
    });
  }

  appendFile(file: File) {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return formData;
  }
  sendUser(user) {
    this.user.next(user);
  }

  getAllUserRole() {
    return this.apiService.get("/admin/get/all/role").pipe(
        map(data => {
            return data;
        })
    );
}

deleteUserRole(userRoleId) {
    return this.apiService
        .delete(`/admin/delete-user-role?userRoleId=${userRoleId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

deleteMultipleUserRole(body): Observable<any> {
    return this.apiService.post(`/admin/delete/role/targetIds`, body).pipe(
        map(data => {
            return data;
        })
    );
}

addUpdateUserRole(body): Observable<any> {
    return this.apiService.post(`/admin/user-role`, body).pipe(
        map(data => {
            return data;
        })
    );
}

getActivityParentAndChild() {
    return this.apiService.get("/admin/get/all/activityParents").pipe(
        map(data => {
            return data;
        })
    );
}

getNewUserRoles(userRoleId) {
    return this.apiService.get(`/admin/get/all/roleActivities/roleId?RoleId=${userRoleId}`).pipe(
        map(data => {
            return data;
        })
    );
}

getActivities() {
    return this.apiService.get("/admin/all-activities").pipe(
        map(data => {
            return data;
        })
    );
}

getRolesAndActivities() {
    return this.apiService.get("/admin/all-role-activities").pipe(
        map(data => {
            return data;
        })
    );
}

getActivitiesByRoleId(userRoleId) {
    return this.apiService
        .get(`/admin/role-activities?userRoleId=${userRoleId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

assignAccessRight(body): Observable<any> {
    return this.apiService.post(`/admin/manage-access`, body).pipe(
        map(data => {
            return data;
        })
    );
}

addUserRoleActivity(body): Observable<any> {
    return this.apiService.post(`/admin/user-role-activities`, body).pipe(
        map(data => {
            return data;
        })
    );
}

  addUserRoleAndActivity(body): Observable<any> {
      return this.apiService.post(`/admin/add/update/roleActivity`, body).pipe(
          map(data => {
              return data;
          })
      );
  }
}
