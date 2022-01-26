import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
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
  constructor(
    public dialog: MatDialog,
    private _payout: PayoutService,
    private _base: BaseComponent
  ) { }

  ngOnInit(): void {
    this.getUserPayouts();
  }

  public getUserPayouts(): void {
    this.isFetchingPayout = true;
    this.sub.add(
      this._payout.getPayout('1').subscribe({
        next: (res: any) => {
          this.isFetchingPayout = false;
          this.payouts = res['payoutSetupTypes'];
          console.log(res, this.payouts)
        },
        error: (error: ResponseModel<null>) => {
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
    this.payoutSetupFormSubmitted = true;
    payout.trainingProviderId = 1;
    // payload.trainingProviderId = this.data?.editObject?.trainingProviderId;
    payout.account_Default = !payout.account_Default;
    console.log(payout);
    this.sub.add(
      this._payout.updatePayoutSetup(payout).subscribe({
        next: (res: ResponseModel<Payout>) => {
          this.payoutSetupFormSubmitted = false;
          console.log(res);
          this.payoutSetupFormSubmitted = false;
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: any) => {
          this.payoutSetupFormSubmitted = false;
          console.log(error);
        },
      })
    );
  }

}
