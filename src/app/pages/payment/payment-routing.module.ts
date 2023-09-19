import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSetupComponent } from './components/payment-setup/payment-setup.component';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full', },
  { path: '', component:  PaymentSetupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
