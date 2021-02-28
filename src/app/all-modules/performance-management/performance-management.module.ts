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
import { AppraisalPreferenceComponent } from "./appraisal-preference/appraisal-preference.component";
import { AppraisalObjectiveViewComponent } from './appraisal-objective-view/appraisal-objective-view.component';
import { AppraisalObjectiveFormComponent } from "./appraisal-objective-form/appraisal-objective-form.component";
import { AppraisalObjectivesComponent } from './appraisal-objectives/appraisal-objectives.component';



@NgModule({
  declarations: [PerformanceManagementComponent, KpiCategoryComponent,KeyPerformanceIndicatorsComponent,GradeSettingComponent, PointSettingsComponent,AppraisalPreferenceComponent, AppraisalObjectiveViewComponent,AppraisalObjectiveFormComponent, AppraisalObjectivesComponent],
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
