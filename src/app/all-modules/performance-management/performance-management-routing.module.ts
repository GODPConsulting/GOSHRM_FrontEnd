import { PointSettingsComponent } from "./point-settings/point-settings.component";
import { KpiCategoryComponent } from "./kpi-category/kpi-category.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceManagementComponent } from "./performance-management.component";
import { KeyPerformanceIndicatorsComponent } from "./key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./grade-setting/grade-setting.component";
import { AppraisalPreferenceComponent } from "./appraisal-preference/appraisal-preference.component";
import { AppraisalObjectiveViewComponent } from "./appraisal-objective-view/appraisal-objective-view.component";
import { AppraisalObjectiveFormComponent } from "./appraisal-objective-form/appraisal-objective-form.component";
import { AppraisalObjectivesComponent } from "./appraisal-objectives/appraisal-objectives.component";

const routes: Routes = [
  {
    path: "",
    component: PerformanceManagementComponent,
    children: [
      {
        path: "kpi-category",
        component: KpiCategoryComponent,
      },
      {
        path: 'kpi-indicators',
        component: KeyPerformanceIndicatorsComponent
      },
      {
        path: 'grade-setting',
        component: GradeSettingComponent
      },
      {
        path: "point-settings",
        component: PointSettingsComponent,
      },
      {
        path: "appraisal-preference",
        component: AppraisalPreferenceComponent,
      },
      {
        path: "appraisal-objective-view",
        component: AppraisalObjectiveViewComponent,
      },
      {
        path: "appraisal-objective-form",
        component: AppraisalObjectiveFormComponent,
      },
      {
        path: "appraisal-objectives",
        component: AppraisalObjectivesComponent,
      }
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceManagementRoutingModule {}
