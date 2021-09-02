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
import { AppraisalCycleComponent } from "./setup/appraisal-cycle/appraisal-cycle.component";
import { AppraisalCyclePageComponent } from "./setup/appraisal-cycle/appraisal-cycle-page/appraisal-cycle-page.component";
import { AppraisalFeedbackPageComponent } from "./setup/appraisal-feedback/appraisal-feedback-page/appraisal-feedback-page.component";
import { AppraisalObjectiveViewComponent } from "./setup/appraisal-objective-view/appraisal-objective-view.component";
import { AppraisalObjectiveFormComponent } from "./setup/appraisal-objective-form/appraisal-objective-form.component";
import { AppraisalObjectivesComponent } from "./setup/appraisal-objectives/appraisal-objectives.component";
import { AppraisalsComponent } from "./setup/appraisal-cycle/appraisals/appraisals.component";
import { CustomDatePipe } from "../../../assets/pipes/custom-date.pipe";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TreeTableModule } from "primeng/treetable";
import { ThreesixtyAppraisalsComponent } from "./threesixty-appraisals/threesixty-appraisals.component";
import { ThreesixtyAppraisalComponent } from "./threesixty-appraisal/threesixty-appraisal.component";
import { FeedbackKudosComponent } from "./feedback-kudos/feedback-kudos.component";
import { OthersFeedbackKudosComponent } from "./others-feedback-kudos/others-feedback-kudos.component";
import { MyFeedbackKudosComponent } from "./my-feedback-kudos/my-feedback-kudos.component";
import { CoachingSchedulesComponent } from "./coaching-schedules/coaching-schedules.component";
import { MultiSelectModule } from "primeng/multiselect";
import { InwardNuggetsComponent } from "./components/inward-nuggets/inward-nuggets.component";
import { OutwardNuggetsComponent } from "./components/outward-nuggets/outward-nuggets.component";
import { TooltipModule } from "primeng/tooltip";
import { PerformanceAppraisalFeedbackComponent } from './performance-appraisal-feedback/performance-appraisal-feedback.component';
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
    AppraisalCycleComponent,
    AppraisalCyclePageComponent,
    AppraisalFeedbackPageComponent,
    AppraisalObjectiveViewComponent,
    AppraisalObjectiveFormComponent,
    AppraisalObjectivesComponent,
    AppraisalsComponent,
    CustomDatePipe,
    ThreesixtyAppraisalsComponent,
    ThreesixtyAppraisalComponent,
    FeedbackKudosComponent,
    OthersFeedbackKudosComponent,
    MyFeedbackKudosComponent,
    CoachingSchedulesComponent,
    InwardNuggetsComponent,
    OutwardNuggetsComponent,
    PerformanceAppraisalFeedbackComponent,
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
    BsDatepickerModule.forRoot(),
    MultiSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
  ],
  exports: [AppraisalObjectivesComponent],
})
export class PerformanceManagementModule {}
