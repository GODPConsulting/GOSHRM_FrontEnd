import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { PayoutFormDialogComponent } from '../../dialogs/payout-form-dialog/payout-form-dialog.component';
import { Payout } from '../../models/payout.model';
import { PayoutService } from '../../services/payout.service';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public payouts: Payout[] = [];
  public isFetchingPayout: boolean = false;
  public payoutSetupFormSubmitted: boolean = false;
  public loggedInUser: any;

  constructor(
    public dialog: MatDialog,
    private _payout: PayoutService,
    private _base: BaseComponent,
    private _currentService: CurrentUserService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.getUserPayouts();
  }

  public getUserPayouts(): void {
    this._helper.startSpinner();
    this.isFetchingPayout = true;
    this.sub.add(
      this._payout.getPayout(this.loggedInUser?.trainingProviderId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingPayout = false;
          this.payouts = res['payoutSetupTypes'];
          console.log(res, this.payouts)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingPayout = false;
          console.log(error);
        },
      })
    );
  }

  public openPayoutDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    if(!payload?.isEditing) {
      payload.editObject.account_TypeId = 1;
    }
    let object: DialogModel<any> = payload;
    console.log(payload)
    const dialogRef = this.dialog.open(PayoutFormDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
          const index = this.payouts.findIndex((payout: Payout) => {
            return payout.payoutId == event?.editObject?.payoutId;
          });
          this.payouts[index] = event?.editObject;
        } else {
          this.payouts = [event?.editObject, ...this.payouts];
        }
      }
    );
  }

  setAsDefault(payout: Payout) {
    this._helper.startSpinner();
    this.payoutSetupFormSubmitted = true;
    payout.trainingProviderId = this.loggedInUser.trainingProviderId;
    payout.payoutId = payout?.payoutId;
    payout.account_Default = !payout.account_Default;
    console.log(payout);
    this.sub.add(
      this._payout.updatePayoutSetup(payout, this.loggedInUser.trainingProviderId).subscribe({
        next: (res: ResponseModel<Payout>) => {
          this._helper.stopSpinner();
          this.payoutSetupFormSubmitted = false;
          console.log(res);
          this.payoutSetupFormSubmitted = false;
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
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
