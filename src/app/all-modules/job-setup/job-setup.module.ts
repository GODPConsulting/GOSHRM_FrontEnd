import { SearchbarComponent } from './searchbar/searchbar.component';
import { SetupComponent } from './setup/setup.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { JobSetupRoutingModule } from "./job-setup-routing.module";
import { JobSetupComponent } from "./job-setup.component";
import { ReportComponent } from "./report/report.component";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";
import { TemplateComponent } from "./template/template.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AdminComponent } from './admin/admin.component';
import { SocialMediaComponent } from './social-media/social-media.component';

@NgModule({
  declarations: [
    SetupComponent,
    SearchbarComponent,
    JobSetupComponent,
    ReportComponent,
    TemplateComponent,
    AdminComponent,
    SocialMediaComponent,
  ],
  imports: [
    CommonModule,
    JobSetupRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class JobSetupModule {}
