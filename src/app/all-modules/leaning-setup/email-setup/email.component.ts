import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
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
   public emailSetupForm: FormGroup;
   public emailId: number;
   public emailSetupInfo: any = {
    "emailId": 0,
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
    // $(function(){
    //     var $select = $(".restricton");
    //     for (let i=1;i<=100;i++){
    //         $select.append($('<option></option>').val(i).html(i))
    //     }
    // });​
    this.initEmailSetupForm();
    this.getEmailSetupInfo();
  }

  initEmailSetupForm() {
    this.emailSetupForm = this.fb.group({
      email_Address: [this.emailSetupInfo?.email_Address ? this.emailSetupInfo?.email_Address  : '' ],
      full_Name: [this.emailSetupInfo?.full_Name ? this.emailSetupInfo?.full_Name  : '' ],
      password: [this.emailSetupInfo?.password ? this.emailSetupInfo?.password  : '' ],
      emailRestrictionList: [this.emailSetupInfo?.emailRestrictionList ? this.emailSetupInfo?.emailRestrictionList  : '' ],
    })
  }

  getEmailSetupInfo() {
    this.sub.add(
      this._lmsService.getAllEmailSetup(this.emailId).subscribe({
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
    this.sub.add(
      this._lmsService.updateEmailSetup(this.emailSetupForm.value).subscribe({
        next: (res) => {
          this.isFetchingEmailSetup = false;
          console.log(res);
        },
        error: (error) => {
          this.isFetchingEmailSetup = false;
          console.log(error);
        },
      })
    );
  }

}
