import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllModulesComponent } from "./all-modules.component";
import { AuthGuard } from "../guards/auth.guard";
import {EventsComponent} from "../shared/events/events.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AllModulesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "employees",
        loadChildren: () =>
          import("./employees/employees.module").then((m) => m.EmployeesModule),
      },
      {
        path: "setup",
        loadChildren: () =>
          import("./setup/setup.module").then((m) => m.SetupModule),
      },
      {
        path: "performance",
        loadChildren: () =>
          import("./performance-management/performance-management.module").then(
            (m) => m.PerformanceManagementModule
          ),
      },
      {
        path: "rms",
        loadChildren: () =>
          import("./job-setup/job-setup.module").then((m) => m.JobSetupModule),
      },
      {
        path: "lms",
        loadChildren: () =>
          import("./leaning-setup/learning-setup.module").then((m) => m.LearningSetupModule),
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: "manager",
        loadChildren: () =>
          import("./manager/manager.module").then((m) => m.ManagerModule),
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: "reward-management",
        loadChildren: () =>
          import("./reward-management/reward-management.module").then((m) => m.RewardManagementModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllModulesRoutingModule {}
