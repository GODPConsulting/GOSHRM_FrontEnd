import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    MatDialogModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class RegistrationModule {}
