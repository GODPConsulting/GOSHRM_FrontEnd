import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyInformationComponent } from "./company-information/company-information.component";
import { CoursesComponent } from "./courses/courses.component";
import { EmailSetupComponent } from "./email-setup/email.component";
import { LearningSetupComponent } from "./learning-setup.component";
import { PayoutComponent } from "./payout/payout.component";
import { PolicyComponent } from "./policy/policy.component";
import { SecurityComponent } from "./security/security.component";
import { TrainingProviderComponent } from "./training-provider/training-provider.component";

const routes: Routes = [
  {
    path: "",
    component: LearningSetupComponent,
    children: [
      {
        path: "information",
        component: CompanyInformationComponent,
      },
      {
        path: "security",
        component: SecurityComponent,
      },
      {
        path: "setup",
        // component: AdminComponent,
      },
      {
        path: "courses",
        component: CoursesComponent,
      },
      {
        path: "policy",
        component: PolicyComponent,
      },
      {
        path: "payout",
        component: PayoutComponent,
      },
      {
        path: "email-setup",
        component: EmailSetupComponent,
      },
      {
        path: "training-provider",
        component: TrainingProviderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningSetupRoutingModule {}
