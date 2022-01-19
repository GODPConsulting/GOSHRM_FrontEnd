import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    SharedModule
  ]
})
export class AccountSettingsModule { }
