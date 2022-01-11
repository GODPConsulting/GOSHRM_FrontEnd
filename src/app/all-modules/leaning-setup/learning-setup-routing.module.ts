import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyInformationComponent } from "./company-information/company-information.component";
import { EmailSetupComponent } from "./email-setup/email.component";
import { LearningSetupComponent } from "./learning-setup.component";
import { PayoutComponent } from "./payout/payout.component";
import { PolicyComponent } from "./policy/policy.component";
import { SecurityComponent } from "./security/security.component";

const routes: Routes = [
  {
    path: "",
    component: EmailSetupComponent,
    // component: LearningSetupComponent,
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
        // component: SocialMediaComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningSetupRoutingModule {}
