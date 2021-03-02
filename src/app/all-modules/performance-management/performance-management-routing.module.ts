import { AppraisalFeedbackPageComponent } from "./setup/appraisal-feedback/appraisal-feedback-page/appraisal-feedback-page.component";
import { AppraisalFeedbackComponent } from "./setup/appraisal-feedback/appraisal-feedback.component";
import { AppraisalCyclePageComponent } from "./setup/appraisal-cycle/appraisal-cycle-page/appraisal-cycle-page.component";
import { AppraisalCycleComponent } from "./setup/appraisal-cycle/appraisal-cycle.component";
import { PointSettingsComponent } from "./setup/point-settings/point-settings.component";
import { KpiCategoryComponent } from "./setup/kpi-category/kpi-category.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceManagementComponent } from "./performance-management.component";
import { KeyPerformanceIndicatorsComponent } from "./setup/key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./setup/grade-setting/grade-setting.component";
import { KpiToJobgradeComponent } from "./setup/kpi-to-jobgrade/kpi-to-jobgrade.component";
import { AppraisalPreferenceComponent } from "./setup/appraisal-preference/appraisal-preference.component";
import { AppraisalsComponent } from "./setup/appraisal-cycle/appraisals/appraisals.component";

const routes: Routes = [
  {
    path: "",
    component: PerformanceManagementComponent,
    children: [
      {
        path: "setup/kpi-category",
        component: KpiCategoryComponent,
      },
      {
        path: "setup/kpi-indicators",
        component: KeyPerformanceIndicatorsComponent,
      },
      {
        path: "setup/grade-setting",
        component: GradeSettingComponent,
      },
      {
        path: "setup/point-settings",
        component: PointSettingsComponent,
      },
      {
        path: "setup/appraisal-preference",
        component: AppraisalPreferenceComponent,
      },
      {
        path: "setup/appraisal-cycle",
        component: AppraisalCycleComponent,
      },
      {
        path: "setup/appraisal-cycle/appraisal-cycle-page",
        component: AppraisalCyclePageComponent,
      },
      {
        path: "setup/appraisal-feedback",
        component: AppraisalFeedbackComponent,
      },
      {
        path: "setup/appraisal-cycle/appraisals",
        component: AppraisalsComponent,
      },
      {
        path: "setup/appraisal-feedback/appraisal-feedback-page",
        component: AppraisalFeedbackPageComponent,
      },
      {
        path: "setup/kpi-to-jobgrade",
        component: KpiToJobgradeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceManagementRoutingModule {}
