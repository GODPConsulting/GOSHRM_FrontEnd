import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddNewUserDialogComponent } from './dialogs/add-new-user-dialog/add-new-user-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    AddNewUserDialogComponent
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
  ]
})
export class AccountSettingsModule { }
