import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    ConfirmationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ConfirmationModule {}
