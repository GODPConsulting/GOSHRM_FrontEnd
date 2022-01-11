import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

import { LearningSetupRoutingModule } from "./learning-setup-routing.module";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CompanyInformationComponent } from "./company-information/company-information.component";
import { SecurityComponent } from "./security/security.component";
import { PayoutComponent } from "./payout/payout.component";
import { PolicyComponent } from "./policy/policy.component";
import { CoursesComponent } from "./courses/courses.component";
import { EmailSetupComponent } from "./email-setup/email.component";
import { TrainingProviderComponent } from "./training-provider/training-provider.component";
import { LearningSetupComponent } from "./learning-setup.component";

@NgModule({
  declarations: [
    LearningSetupComponent,
   
  ],
  imports: [
    CommonModule,
    LearningSetupRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class LearningSetupModule {}
