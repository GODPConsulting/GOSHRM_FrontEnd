import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: "app-email-setup",
  templateUrl: "./email-setup.component.html",
  styleUrls: ["./email-setup.component.css"],
})

export class EmailSetupComponent implements OnInit {
  public sub: Subscription = new Subscription();
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;
   public isFetchingEmailSetup: boolean = false;
   public emailSetupFormSubmitted: boolean = false;
   public emailSetupForm: FormGroup;
   public companyId: number;
   public emailSetupInfo: any = {
    "email_Address": "",
    "full_Name": "",
    "password": "",
    "emailRestrictionList": "",
  }

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    this.initEmailSetupForm();
    this.getEmailSetupInfo();
  }

  initEmailSetupForm() {
    this.emailSetupForm = this.fb.group({
      email_Address: [this.emailSetupInfo?.email_Address ? this.emailSetupInfo?.email_Address  : '', Validators.required],
      full_Name: [this.emailSetupInfo?.full_Name ? this.emailSetupInfo?.full_Name  : '', Validators.required ],
      password: [this.emailSetupInfo?.password ? this.emailSetupInfo?.password  : '', Validators.required ],
      emailRestrictionList: [this.emailSetupInfo?.emailRestrictionList ? this.emailSetupInfo?.emailRestrictionList  : '', Validators.required ],
    })
  }

  getEmailSetupInfo() {
    this.sub.add(
      this._lmsService.getAllEmailSetup(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingEmailSetup = false;
          this.emailSetupInfo = res;
          console.log(res);
        },
        error: (error) => {
          this.isFetchingEmailSetup = false;
          console.log(error);
        },
      })
    );
  }

  updateEmailSetup() {
    this.emailSetupFormSubmitted = true;
    this.sub.add(
      this._lmsService.updateEmailSetup(this.emailSetupForm.value).subscribe({
        next: (res) => {
          this.emailSetupFormSubmitted = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.initEmailSetupForm();
            });
          } else {
            swal.fire("GOSHRM", "error");
          }
        },
        error: (error) => {
          this.emailSetupFormSubmitted = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }

}
