import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { CommunicationComponent } from './components/communication/communication.component';
import { MessagesComponent } from './components/messages/messages.component';
import { QaComponent } from './components/qa/qa.component';
import { ViewMessageComponent } from './components/view-message/view-message.component';
import { CommunicationResolver } from './resolvers/communication.resolver';

const routes: Routes = [
  { 
    path: '',
    component: CommunicationComponent,
    resolve: [CommunicationResolver]
  },
  { 
    path: 'qa/:courseId',
    component: QaComponent,
  },
  { 
    path: 'messages',
    component: MessagesComponent,
  },
  { 
    path: 'view-message/:id',
    component: ViewMessageComponent,
  },
  { 
    path: 'announcement',
    component: AnnouncementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule {}
