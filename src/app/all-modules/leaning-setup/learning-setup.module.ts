import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

import { LearningSetupRoutingModule } from "./learning-setup-routing.module";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CompanyInformationComponent } from "./company-information/company-information.component";
import { SecurityComponent } from "./security/security.component";

@NgModule({
  declarations: [
   CompanyInformationComponent, SecurityComponent
  ],
  imports: [
    CommonModule,
    LearningSetupRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule
  ],
})
export class LearningSetupModule {}
