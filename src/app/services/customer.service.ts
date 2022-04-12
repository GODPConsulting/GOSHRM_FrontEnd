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
export class CustomerService {
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

  getAllCustomer() {
    return this.apiService.get("/customer/allcustomer").pipe(
        tap(data => {
            return data;
        })
    );
}

getAllCustomerAuthorization() {
    return this.apiService.get("/customer/allcustomerauthorization").pipe(
        tap(data => {
            return data;
        })
    );
}

getAllCustomerBusinessOwner() {
    return this.apiService.get("/customer/allcustomerbusinessowner").pipe(
        tap(data => {
            return data;
        })
    );
}

getAllCustomerDocument() {
    return this.apiService.get("/customer/allcustomerdocument").pipe(
        tap(data => {
            return data;
        })
    );
}

getCustomerByCountry(countryId) {
    return this.apiService
        .get(`/customer/customerbycountry?countryId=${countryId}`)
        .pipe(
            tap(data => {
                return data;
            })
        );
}

getCustomer(customerId) {
    return this.apiService
        .get(`/customer/customer?customerId=${customerId}`)
        .pipe(
            tap(data => {
                return data;
            })
        );
}

getCustomerAuthorization(customerAuthorizationId) {
    return this.apiService
        .get(
            `/customer/customerauthorization?customerAuthorizationId=${customerAuthorizationId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}

getCustomerBusinessOwner(customerBusinessOwnerId) {
    return this.apiService
        .get(
            `/customer/customerbusinessowner?customerBusinessOwnerId=${customerBusinessOwnerId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}

getCustomerDocument(customerDocumentId) {
    return this.apiService
        .get(
            `/customer/customerdocument?customerDocumentId=${customerDocumentId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}

deleteCustomer(customerId) {
    return this.apiService
        .delete(`/customer/delete?customerId=${customerId}`)
        .pipe(
            tap(data => {
                return data;
            })
        );
}
deleteCustomerAuthorization(customerAuthorizationId) {
    return this.apiService
        .delete(
            `/customer/deleteauthorization?customerAuthorizationId=${customerAuthorizationId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}
deleteCustomerBusinessOwner(customerBusinessOwnerId) {
    return this.apiService
        .delete(
            `/customer/deletebusinessowner?customerBusinessOwnerId=${customerBusinessOwnerId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}
deleteCustomerDocument(customerDocumentId) {
    return this.apiService
        .delete(
            `/customer/deletedocument?customerDocumentId=${customerDocumentId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
}

addCustomerInformation(body): Observable<any> {
    return this.apiService.post(`/customer/updatecustomer`, body).pipe(
        tap(data => {
            return data;
        })
    );
}
addCustomerAuthorization(body): Observable<any> {
    return this.apiService
        .post(`/customer/updatecustomerauthorization`, body)
        .pipe(
            tap(data => {
                return data;
            })
        );
}
addCustomerBusinessOwner(body): Observable<any> {
    return this.apiService.post(`/customer/updatebusinessowner`, body).pipe(
        tap(data => {
            return data;
        })
    );
}
addCustomerDocument(body): Observable<any> {
    return this.apiService.post(`/customer/updatedocument`, body).pipe(
        tap(data => {
            return data;
        })
    );
}



goForApproval(body): Observable<any> {
    return this.apiService.post(`/customer/approval`, body).pipe(
        tap(data => {
            return data;
        })
    );
}

addUpdateDocumentType(body): Observable<any> {
    return this.apiService.post(`/loanCustomer/document-type`, body).pipe(
        tap(data => {
            return data;
        })
    );
}

getAllDocumentType() {
    return this.apiService.get("/loanCustomer/all-document-type").pipe(
        tap(data => {
            return data;
        })
    );
}

deleteDocumentType(documentTypeId) {
    return this.apiService
        .delete(
            `/loanCustomer/delete-document-type?documentTypeId=${documentTypeId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
    }

}
