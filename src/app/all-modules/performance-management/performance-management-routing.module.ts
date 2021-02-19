import { AcademicDisciplineComponent } from "./../setup/academic-discipline/academic-discipline.component";
import { KpiCategoryComponent } from "./kpi-category/kpi-category.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceManagementComponent } from "./performance-management.component";
import { KeyPerformanceIndicatorsComponent } from "./key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./grade-setting/grade-setting.component";

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
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceManagementRoutingModule {}
