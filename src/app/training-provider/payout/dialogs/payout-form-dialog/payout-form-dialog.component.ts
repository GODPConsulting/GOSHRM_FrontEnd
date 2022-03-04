import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { Payout } from '../../models/payout.model';
import { PayoutService } from '../../services/payout.service';

@Component({
  selector: 'app-payout-form-dialog',
  templateUrl: './payout-form-dialog.component.html',
  styleUrls: ['./payout-form-dialog.component.scss']
})

export class PayoutFormDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public payoutForm!: FormGroup;
  public isLoading: boolean =false;
  public payoutSetupFormSubmitted: boolean = false;
  public loggedInUser: any;
  
  @Output() event: EventEmitter<{
    editObject?: Payout;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: Payout; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<PayoutFormDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Payout>,
    public fb: FormBuilder,
    private _payoutService: PayoutService,
    public _base: BaseComponent,
    private _currentService: CurrentUserService,
    public _helper: HelperService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._currentService.getUser();
    this.initPayoutSetupForm();
  }

  initPayoutSetupForm() {
    this.payoutForm = this.fb.group({
      account_TypeId: [this.data?.editObject?.account_TypeId ? this.data?.editObject?.account_TypeId  : '', Validators.required ],
      paypal_Email: [this.data?.editObject?.paypal_Email ? this.data?.editObject?.paypal_Email  : '' ],
      paypal_Name: [this.data?.editObject?.paypal_Name ? this.data?.editObject?.paypal_Name  : '' ],
      bank_Name: [this.data?.editObject?.bank_Name ? this.data?.editObject?.bank_Name  : '' ],
      account_Name: [this.data?.editObject?.account_Name ? this.data?.editObject?.account_Name  : '' ],
      account_Number: [this.data?.editObject?.account_Number ? this.data?.editObject?.account_Number  : '' ],
      account_Default: [this.data?.editObject?.account_Default ? this.data?.editObject?.account_Default  : false ],
    })
  }

  changeForm() {
    let accountType = (<HTMLInputElement>document.getElementById('accountType')).value;
    if(accountType == '2') {
      this.data.editObject.account_TypeId = 2;
    } else {
      this.data.editObject.account_TypeId = 1;
    }
  }

  setDefault() {
    let checkDefault = (<HTMLInputElement>document.getElementById('checkDefault')).checked;
    console.log(checkDefault)
    // this.payoutListItem.account_Default = checkDefault;
  }


  submit() {
    this._helper.startSpinner();
    this.payoutSetupFormSubmitted = true;
    const payload = this.payoutForm.value;
    payload.account_TypeId = parseInt(payload.account_TypeId);
    payload.trainingProviderId = this.loggedInUser?.trainingProviderId;
    payload.payoutId = this.data?.editObject?.payoutId;
    console.log(payload);
    this.sub.add(
      this._payoutService.updatePayoutSetup(payload, this.loggedInUser?.trainingProviderId).subscribe({
        next: (res: any) => {
          this.payoutSetupFormSubmitted = false;
          console.log(res);
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            if (this.data?.isEditing) {
              payload.payoutId = payload?.payoutId;
              payload.deleted = false;
            } else {
              payload.payoutId = res;
            }
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.payoutSetupFormSubmitted = false;
            this.close.nativeElement.click();
            this._base.openSnackBar(
              'Great...!!!, Your action was successful',
              'success'
            );
          } else {
            this._helper.stopSpinner();
            this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
          }
        },
        error: (error: any) => {
          this._helper.stopSpinner();
          this.payoutSetupFormSubmitted = false;
          console.log(error);
        },
      })
    );
  }

}
