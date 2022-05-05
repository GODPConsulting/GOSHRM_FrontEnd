import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingProviderRoutingModule } from './traning-provider-routing.module';
import { FaqHelpComponent } from './faq-help/faq-help.component';
import { FaqComponent } from './faq-help/components/faq/faq.component';
import { FaqDialogComponent } from './faq-help/dialogs/faq-dialog/faq-dialog.component';



@NgModule({
  declarations: [
    FaqHelpComponent,
    FaqComponent,
    FaqDialogComponent
  ],
  imports: [
    CommonModule,
    TrainingProviderRoutingModule
  ]
})
export class TraningProviderModule { }
