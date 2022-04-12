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
export class CountriesService {
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



getAllCountry() {
    return this.apiService.get("/country/allcountry").pipe(
        map(data => {
            return data;
        })
    );
}



deleteCountry(countryId) {
    return this.apiService
        .delete(`/country/delete?countryId=${countryId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

updateCountry(body): Observable<any> {
    return this.apiService.post(`/country/update`, body).pipe(
        map(data => {
            return data;

        })
    );
}



getAllJobTitle() {
    return this.apiService.get("/common/jobTitles").pipe(
        map(data => {
            return data;
        })
    );
}

getJobTitle(jobTitleId) {
    return this.apiService
        .get(`/country/single-job-title?jobTitleId=${jobTitleId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}

deleteJobTitle(jobTitleId) {
    return this.apiService
        .delete(`/country/job-title?jobTitleId=${jobTitleId}`)
        .pipe(
            map(data => {
                return data;
            })
        );
}


exportJobTitle() {
    return this.apiService.getExcel("/common/download/jobtitle").pipe(
        map(data => {
            return data;
        })
    );
}

uploadJobTitle(imageFile: File): Promise<any> {
    return this.apiService
        .uploadExcel("/common/upload/jobtitle", imageFile)
        .then(
            data => {
                return data;
            }
        );
}

addUpdateJobTitle(body): Observable<any> {
    return this.apiService.post(`/country/job-title`, body).pipe(
        map(data => {
            return data;
        })
    );
}
}
