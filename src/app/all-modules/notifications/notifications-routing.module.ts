import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotificationDetailsComponent } from "./notification-details/notification-details.component";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NotificationsComponent } from "./notifications.component";

const routes: Routes = [
  {
    path: "",
    component: NotificationsComponent,
    children: [
      { path: "notification-list", component: NotificationListComponent },
      {
        path: "notification-details/:id",
        component: NotificationDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
