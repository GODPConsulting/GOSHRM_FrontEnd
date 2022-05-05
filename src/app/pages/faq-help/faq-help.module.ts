import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqHelpRoutingModule } from './faq-help-routing.module';
import { FaqComponent } from './components/faq/faq.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqDialogComponent } from './dialogs/faq-dialog/faq-dialog.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [FaqComponent, FaqDialogComponent],
  imports: [
    CommonModule,
    FaqHelpRoutingModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class FaqHelpModule { }
