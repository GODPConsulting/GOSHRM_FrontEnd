import { AppraisalFeedbackComponent } from "./setup/appraisal-feedback/appraisal-feedback.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularDualListBoxModule } from "angular-dual-listbox";
import { PerformanceManagementRoutingModule } from "./performance-management-routing.module";
import { KpiCategoryComponent } from "./setup/kpi-category/kpi-category.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "src/app/services/http.interceptor.service";
import { PerformanceManagementComponent } from "./performance-management.component";
import { PointSettingsComponent } from "./setup/point-settings/point-settings.component";
import { SharedModule } from "src/app/shared/shared.module";
import { KeyPerformanceIndicatorsComponent } from "./setup/key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./setup/grade-setting/grade-setting.component";
import { KpiToJobgradeComponent } from "./setup/kpi-to-jobgrade/kpi-to-jobgrade.component";
import { AppraisalPreferenceComponent } from "./setup/appraisal-preference/appraisal-preference.component";

@NgModule({
  declarations: [
    PerformanceManagementComponent,
    KpiCategoryComponent,
    KeyPerformanceIndicatorsComponent,
    GradeSettingComponent,
    PointSettingsComponent,
    KpiToJobgradeComponent,
    AppraisalPreferenceComponent,
    AppraisalFeedbackComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    PerformanceManagementRoutingModule,
    AngularDualListBoxModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
  ],
})
export class PerformanceManagementModule {}
