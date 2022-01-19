import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: "app-payout",
  templateUrl: "./payout.component.html",
  styleUrls: ["./payout.component.css"],
})

export class PayoutComponent implements OnInit {
    public sub: Subscription = new Subscription();
   public spinner: boolean = false;
   public isPayoutReady: boolean = false;
   public payoutSetupFormSubmitted: boolean = false;
   public payoutForm: FormGroup;
   public payoutId: number;
   public payoutList: any =  {
    "account_Type": "",
    "account_Email": "",
    "account_Name": "",
  }

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.initPayoutSetupForm();
    this.payoutForm.disable();
    this.getPayoutSetupInfo();
  }

  openAccountModal() {
    $("#account-modal").modal("show");
    this.payoutForm.enable();
  }

  closeAccountModal() {
    $("#account-modal").modal("hide");
    this.payoutForm.disable();
  }

  initPayoutSetupForm() {
    this.payoutForm = this.fb.group({
      account_Type: [this.payoutList?.account_Type ? this.payoutList?.account_Type  : '', Validators.required ],
      account_Email: [this.payoutList?.account_Email ? this.payoutList?.account_Email  : '', Validators.required ],
      account_Name: [this.payoutList?.account_Name ? this.payoutList?.account_Name  : '', Validators.required ],
    })
  }

  getPayoutSetupInfo() {
    this.sub.add(
      this._lmsService.getAllEmailSetup(this.payoutId).subscribe({
        next: (res) => {
          this.isPayoutReady = false;
          this.payoutList = res;
          console.log(res);
        },
        error: (error) => {
          this.isPayoutReady = false;
          console.log(error);
        },
      })
    );
  }

  updatePayoutSetup() {
    this.payoutSetupFormSubmitted = true;
    this.sub.add(
      this._lmsService.updatePayoutSetup(this.payoutForm.value).subscribe({
        next: (res) => {
          this.payoutSetupFormSubmitted = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.initPayoutSetupForm();
              this.closeAccountModal();
            });
          } else {
            swal.fire("GOSHRM", "error");
          }
        },
        error: (error) => {
          this.payoutSetupFormSubmitted = false;
          console.log(error);
        },
      })
    );
  }
  
}
