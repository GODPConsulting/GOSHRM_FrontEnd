import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { QaComponent } from './components/qa/qa.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { CommunicationRoutingModule } from './communication-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { QuestionDialogComponent } from './dialogs/question-dialog/question-dialog.component';
import { CommunicationComponent } from './components/communication/communication.component';
import { ViewMessageComponent } from './components/view-message/view-message.component';
import { SendMessageComponent } from './components/send-message/send-message.component';



@NgModule({
  declarations: [
    QaComponent,
    MessagesComponent,
    AnnouncementComponent,
    QuestionDialogComponent,
    CommunicationComponent,
    ViewMessageComponent,
    SendMessageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CommunicationRoutingModule,
    AngularEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
  ]
})
export class CommunicationModule { }
