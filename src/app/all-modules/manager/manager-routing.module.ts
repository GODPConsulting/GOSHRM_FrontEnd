import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DirectReportAppraisalsComponent } from "./direct-report-appraisals/direct-report-appraisals.component";
import { ManagerComponent } from "./manager.component";

const routes: Routes = [
  {
    path: "",
    component: ManagerComponent,
    children: [
      {
        path: "direct-report-appraisals",
        component: DirectReportAppraisalsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
