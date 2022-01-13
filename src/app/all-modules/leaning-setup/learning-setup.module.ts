import { PageSetupComponent } from './page-setup/page-setup.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LearningSetupRoutingModule } from "./learning-setup-routing.module";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
    // CompanyInformationComponent,
    // SecurityComponent,
    // PayoutComponent,
    // PolicyComponent,
    // CoursesComponent,
    // EmailSetupComponent,
    // TrainingProviderComponent,
    // PageSetupComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    LearningSetupRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class LearningSetupModule {}
