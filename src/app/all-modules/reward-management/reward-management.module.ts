import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './components/payroll/payroll.component';
import { RewardManagementRoutingModule } from './reward-management-routing.module';
import { PayrollSettingsComponent } from './components/payroll-settings/payroll-settings.component';
import { EarningItemsComponent } from './components/payroll-settings/components/earning-items/earning-items.component';
import { BankSetupComponent } from './components/payroll-settings/components/bank-setup/bank-setup.component';
import { ContributionsComponent } from './components/payroll-settings/components/contributions/contributions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PayrollComponent, 
    PayrollSettingsComponent, 
    EarningItemsComponent, 
    BankSetupComponent, ContributionsComponent
  ],
  imports: [
    CommonModule, RewardManagementRoutingModule, ReactiveFormsModule, FormsModule
  ]
})

export class RewardManagementModule { }
