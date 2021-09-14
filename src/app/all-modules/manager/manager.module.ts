import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManagerRoutingModule } from "./manager-routing.module";
import { ManagerComponent } from "./manager.component";
import { DirectReportAppraisalsComponent } from "./direct-report-appraisals/direct-report-appraisals.component";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";
import { EmployeeAppraisalsComponent } from "./employee-appraisals/employee-appraisals.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PerformanceManagementModule } from "../performance-management/performance-management.module";
import { AppraisalsComponent } from './appraisals/appraisals.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';

@NgModule({
  declarations: [
    ManagerComponent,
    DirectReportAppraisalsComponent,
    EmployeeAppraisalsComponent,
    AppraisalsComponent,
    FeedbacksComponent,
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
    PerformanceManagementModule,
  ],
})
export class ManagerModule {}
