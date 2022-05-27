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
    "emailId": 0,
    "stmp_Client": "",
    "sender_Email": "",
    "sender_Username": "",
    "smtp_Port": "",
    "mail_Caption": "",
    "sender_Password": "",
    "send_notification": false,
    "enableSSl": false,
    "baseFrontEndURL": "",
    "companyId": 0
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
      sender_Email: [this.emailSetupInfo?.sender_Email ? this.emailSetupInfo?.sender_Email  : '', Validators.required],
      sender_Username: [this.emailSetupInfo?.sender_Username ? this.emailSetupInfo?.sender_Username  : '', Validators.required ],
      sender_Password: [this.emailSetupInfo?.sender_Password ? this.emailSetupInfo?.sender_Password  : '', Validators.required ],
      stmp_Client: [this.emailSetupInfo?.stmp_Client ? this.emailSetupInfo?.stmp_Client  : '', Validators.required],
      smtp_Port: [this.emailSetupInfo?.smtp_Port ? this.emailSetupInfo?.smtp_Port  : '', Validators.required],
      mail_Caption: [this.emailSetupInfo?.mail_Caption ? this.emailSetupInfo?.mail_Caption  : '', Validators.required],
      send_notification: [this.emailSetupInfo?.send_notification ? this.emailSetupInfo?.send_notification  : false, Validators.required],
      enableSSl: [this.emailSetupInfo?.enableSSl ? this.emailSetupInfo?.enableSSl  : false, Validators.required],
      baseFrontEndURL: [this.emailSetupInfo?.baseFrontEndURL ? this.emailSetupInfo?.baseFrontEndURL  : '', Validators.required],
      emailId: [this.emailSetupInfo?.emailId ? this.emailSetupInfo?.emailId  : 0, Validators.required],
    })
  }

  getEmailSetupInfo() {
    this.sub.add(
      this._lmsService.getAllEmailSetup(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingEmailSetup = false;
          this.emailSetupInfo = res['emailSetupTypes'];
          this.initEmailSetupForm();
          // console.log(res, this.emailSetupInfo);
        },
        error: (error) => {
          this.isFetchingEmailSetup = false;
          console.log(error);
        },
      })
    );
  }

  updateEmailSetup() {
    const payload = this.emailSetupForm.value;
    payload.companyId = this.companyId;
    this.emailSetupFormSubmitted = true;
    this.sub.add(
      this._lmsService.updateEmailSetup(payload).subscribe({
        next: (res) => {
          this.emailSetupFormSubmitted = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.emailSetupInfo = payload;
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
