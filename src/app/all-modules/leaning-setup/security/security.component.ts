import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import { LoadingService } from "src/app/services/loading.service";
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"],
})

export class SecurityComponent implements OnInit {
    public sub: Subscription = new Subscription();
    public changePasswordForm!: FormGroup;
    public showCurrentPassword: boolean = false;
    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;
    public passwordInfo: any;
    public isLoading: boolean = false;
    spinner: boolean = false;
    public profile: any;
    public companyId: number;

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService,
    private _loading: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.initPasswordForm();
    this.getsecurityInfo();
  }

  initPasswordForm() {
    this.changePasswordForm = this.fb.group({
      old_Password: ['', Validators.required],
      new_Password: ['', Validators.required],
      confirm_Password: ['', Validators.required]
    })
  }

  getsecurityInfo() {
    this._loading.show();
    this.sub.add(
      this._lmsService.getSecuritySetup(this.companyId).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          this._loading.hide();
          this.passwordInfo = res['securitySetupTypes'][0];
          console.log(res);
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  updateSecuritySetup() {
    const payload = this.changePasswordForm.value;
    console.log(payload);
    this.sub.add(
      this._lmsService.updateSecuritySetup(payload).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              
            });
          } else {
            swal.fire("GOSHRM", res.status.message.friendlyMessage);
          }
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }

  
}
