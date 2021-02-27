import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NotificationsComponent } from "./notifications.component";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NotificationDetailsComponent } from "./notification-details/notification-details.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationListComponent,
    NotificationDetailsComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    DataTablesModule,
  ],
})
export class NotificationsModule {}
