import { PointSettingsComponent } from "./setup/point-settings/point-settings.component";
import { KpiCategoryComponent } from "./setup/kpi-category/kpi-category.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceManagementComponent } from "./performance-management.component";
import { KeyPerformanceIndicatorsComponent } from "./setup/key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./setup/grade-setting/grade-setting.component";
import { KpiToJobgradeComponent } from "./setup/kpi-to-jobgrade/kpi-to-jobgrade.component";

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
