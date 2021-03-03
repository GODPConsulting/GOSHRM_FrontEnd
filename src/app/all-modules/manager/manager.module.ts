import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManagerRoutingModule } from "./manager-routing.module";
import { ManagerComponent } from "./manager.component";
import { DirectReportAppraisalsComponent } from "./direct-report-appraisals/direct-report-appraisals.component";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ManagerComponent, DirectReportAppraisalsComponent],
  imports: [CommonModule, ManagerRoutingModule, DataTablesModule, SharedModule],
})
export class ManagerModule {}
