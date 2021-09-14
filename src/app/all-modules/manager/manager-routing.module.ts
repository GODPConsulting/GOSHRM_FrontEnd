import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DirectReportAppraisalsComponent } from "./direct-report-appraisals/direct-report-appraisals.component";
import { ManagerComponent } from "./manager.component";
import { EmployeeAppraisalsComponent } from "./employee-appraisals/employee-appraisals.component";
import { AppraisalsComponent } from "./appraisals/appraisals.component";
import { FeedbacksComponent } from "./feedbacks/feedbacks.component";

const routes: Routes = [
  {
    path: "",
    component: ManagerComponent,
    children: [
      {
        path: "direct-report-appraisals",
        component: DirectReportAppraisalsComponent,
      },
      {
        path: "employee-appraisal",
        component: EmployeeAppraisalsComponent,
      },
      {
        path: "appraisals",
        component: AppraisalsComponent,
      },
      {
        path: "feedbacks",
        component: FeedbacksComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
