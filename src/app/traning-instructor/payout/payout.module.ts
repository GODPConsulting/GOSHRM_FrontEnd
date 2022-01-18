import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayoutRoutingModule } from './payout-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PayoutComponent } from './components/payout/payout.component';
import { PayoutFormDialogComponent } from './dialogs/payout-form-dialog/payout-form-dialog.component';

@NgModule({
  declarations: [PayoutComponent, PayoutFormDialogComponent],
  imports: [
    CommonModule,
    PayoutRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PayoutModule { }
