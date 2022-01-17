import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
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
   public payoutForm: FormGroup;
   public payoutId: number;
   public payoutList: any =  {
    "payoutId": 0,
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
    this.getPayoutSetupInfo();
  }

  openAccountModal() {
    $("#account-modal").modal("show");
  }

  closeAccountModal() {
    $("#account-modal").modal("hide");
  }

  initPayoutSetupForm() {
    this.payoutForm = this.fb.group({
      account_Type: [this.payoutList?.account_Type ? this.payoutList?.account_Type  : '' ],
      account_Email: [this.payoutList?.account_Email ? this.payoutList?.account_Email  : '' ],
      account_Name: [this.payoutList?.account_Name ? this.payoutList?.account_Name  : '' ],
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
    this.sub.add(
      this._lmsService.updatePayoutSetup(this.payoutForm.value).subscribe({
        next: (res) => {
          this.isPayoutReady = false;
          console.log(res);
        },
        error: (error) => {
          this.isPayoutReady = false;
          console.log(error);
        },
      })
    );
  }
  
}
