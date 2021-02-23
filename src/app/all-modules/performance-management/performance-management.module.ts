import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerformanceManagementRoutingModule } from "./performance-management-routing.module";
import { KpiCategoryComponent } from "./kpi-category/kpi-category.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "src/app/services/http.interceptor.service";
import { PerformanceManagementComponent } from "./performance-management.component";
import { PointSettingsComponent } from './point-settings/point-settings.component';
import { SharedModule } from "src/app/shared/shared.module";
import { KeyPerformanceIndicatorsComponent } from "./key-performance-indicators/key-performance-indicators.component";
import { GradeSettingComponent } from "./grade-setting/grade-setting.component";
import { AppraisalCycleComponent } from './appraisal-cycle/appraisal-cycle.component';
import { AppraisalCyclePageComponent } from './appraisal-cycle-page/appraisal-cycle-page.component';

@NgModule({
  declarations: [PerformanceManagementComponent, KpiCategoryComponent,KeyPerformanceIndicatorsComponent,GradeSettingComponent, PointSettingsComponent, AppraisalCycleComponent, AppraisalCyclePageComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    PerformanceManagementRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    
  ],
})
export class PerformanceManagementModule { }
