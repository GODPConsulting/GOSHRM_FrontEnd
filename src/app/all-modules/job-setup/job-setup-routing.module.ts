import { TemplateComponent } from './template/template.component';
import { SetupComponent } from './setup/setup.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { JobSetupComponent } from "./job-setup.component";
import { AdminComponent } from "./admin/admin.component";
import { SocialMediaComponent } from "./social-media/social-media.component";
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: "",
    component: JobSetupComponent,
    children: [
      {
        path: "setup",
        component: SetupComponent,
      },
      {
        path: "report",
        component: ReportComponent,
      },
      {
        path: "admin",
        component: AdminComponent,
      },
      {
        path: "social-media",
        component: SocialMediaComponent,
      },
      {
        path: "template",
        component: TemplateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobSetupRoutingModule {}
