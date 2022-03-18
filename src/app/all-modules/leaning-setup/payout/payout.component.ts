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
   public accountType: string = '1';
   public payoutId: number = 0;
   public profile: any;
   public companyId: number;
   public userid: string;
   public payoutList: any;
   public selectedPayout: any[] = [];
   public payoutListItem: any = {
    "payoutId": 0,
    "account_TypeId": 1,
    "paypal_Email": "",
    "paypal_Name": "",
    "bank_Name": "",
    "account_Name": "",
    "account_Number": "",
    "account_Type_Name": "",
    "companyId": 0,
    "account_Default": false
  };

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.userid = this.profile.userId;
    this.initPayoutSetupForm();
    this.getPayoutSetupInfo();
  }

  openAccountModal(payoutDetail) {
    this.payoutListItem = payoutDetail;
    this.accountType = this.payoutListItem.account_TypeId;
    console.log(this.payoutListItem)
    this.initPayoutSetupForm();
    $("#account-modal").modal("show");
  }

  closeAccountModal() {
    $("#account-modal").modal("hide");
  }

  selectDeselectPayout(payout) {
    this.selectedPayout.includes(payout.payoutId)
      ? (this.selectedPayout = this.selectedPayout.filter(
          code => code != payout.payoutId
        ))
      : this.selectedPayout.push(payout.payoutId);
    // console.log(this.selectedPayout);
  }

  initPayoutSetupForm() {
    this.payoutForm = this.fb.group({
      account_TypeId: [this.payoutListItem?.account_TypeId ? this.payoutListItem?.account_TypeId  : '', Validators.required ],
      paypal_Email: [this.payoutListItem?.paypal_Email ? this.payoutListItem?.paypal_Email  : '' ],
      paypal_Name: [this.payoutListItem?.paypal_Name ? this.payoutListItem?.paypal_Name  : '' ],
      bank_Name: [this.payoutListItem?.bank_Name ? this.payoutListItem?.bank_Name  : '' ],
      account_Name: [this.payoutListItem?.account_Name ? this.payoutListItem?.account_Name  : '' ],
      account_Number: [this.payoutListItem?.account_Number ? this.payoutListItem?.account_Number  : '' ],
    })
  }

  changeForm() {
    let accountType = (<HTMLInputElement>document.getElementById('accountType')).value;
    if(accountType == '2') {
      this.accountType = '2';
    } else {
      this.accountType = '1';
    }
  }

  setDefault() {
    let checkDefault = (<HTMLInputElement>document.getElementById('checkDefault')).checked;
    console.log(checkDefault)
    this.payoutListItem.account_Default = checkDefault;
  }

  changeDefaultAccount(payoutId) {
    this.payoutListItem.account_Default = !this.payoutListItem.account_Default;
    console.log(this.payoutListItem.account_Default);
    // this.updatePayoutSetup(payoutId);
  }

  getPayoutSetupInfo() {
    this.sub.add(
      this._lmsService.getAllPayoutSetup(this.companyId, this.userid).subscribe({
        next: (res) => {
          // console.log(res);
          this.isPayoutReady = false;
          this.payoutList = res.payoutSetupTypes;
          // console.log(this.payoutList);
        },
        error: (error) => {
          this.isPayoutReady = false;
          console.log(error);
        },
      })
    );
  }

  updatePayoutSetup(payoutId) {
    this.payoutSetupFormSubmitted = true;
    const payload = this.payoutForm.value;
    payload.account_TypeId = parseInt(payload.account_TypeId);
    payload.companyid = this.companyId;
    payload.payoutId = payoutId;
    payload.paySetUpCreatedByType = 1;
    payload.userid = this.userid;
    payload.account_Default = this.payoutListItem.account_Default;
    console.log(payload);
    this.sub.add(
      this._lmsService.updatePayoutSetup(payload).subscribe({
        next: (res) => {
          this.payoutSetupFormSubmitted = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              if (payload.payoutId != 0) {
                const index = this.payoutList.findIndex((payout) => {
                  return payout.payoutId == payload?.payoutId;
                });
                this.payoutList[index] = payload;
              } else {
                payload.payoutId = res.payoutId;
                this.payoutList = [payload, ...this.payoutList];
              }
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

  deletePayout() {
    if(this.selectedPayout.length == 0) {
      swal.fire("GOSHRM", 'Please select payout to delete')
        .then(() => {
        
      });
    }
    this.payoutSetupFormSubmitted = true;
    const payload = {
      companyId: this.companyId,
      pageContentId: this.selectedPayout,
      type: 1,
      userId: this.userid
    };
    console.log(payload);
    if(this.selectedPayout.length != 0) {
      this.sub.add(
        this._lmsService.deletePayoutSetup(payload).subscribe({
          next: (res) => {
            this.payoutSetupFormSubmitted = false;
            console.log(res);
            if (res.status.isSuccessful) {
              swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
                this.getPayoutSetupInfo();
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
  
}
