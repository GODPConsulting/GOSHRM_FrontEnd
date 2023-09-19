import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentSetupComponent } from './components/payment-setup/payment-setup.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [PaymentSetupComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ]
})
export class PaymentModule { }
