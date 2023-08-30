import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { FaqComponent } from './components/faq/faq.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqDialogComponent } from './dialogs/faq-dialog/faq-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [FaqComponent, FaqDialogComponent],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule
  ]
})
export class PrivacyPolicyModule { }
