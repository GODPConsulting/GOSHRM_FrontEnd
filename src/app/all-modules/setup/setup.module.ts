import { ProfMembershipComponent } from "./prof-membership/prof-membership.component";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SetupRoutingModule } from "./setup-routing.module";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { AcademicQualificationComponent } from "./academic-qualification/academic-qualification.component";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "../../services/http.interceptor.service";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
import { AcademicDisciplineComponent } from "./academic-discipline/academic-discipline.component";
import { EmploymentLevelComponent } from "./employment-level/employment-level.component";
import { AcademicGradeComponent } from "./academic-grade/academic-grade.component";
import { AppModule } from "../../app.module";
import { SharedModule } from "../../shared/shared.module";
import { JobGradeComponent } from "./job-grade/job-grade.component";
import { HmoComponent } from "./hmo/hmo.component";
import { Ng2SearchPipeModule } from "ng2-search-filter"; // Search module
import { GymWorkoutComponent } from "./gym-workout/gym-workout.component";
import { HighSchoolGradeComponent } from "./high-school-grade/high-school-grade.component";
import { LanguageComponent } from "./language/language.component";
import { JobTitleComponent } from "src/app/all-modules/setup/job-title/job-title.component";
import { ProfCertificationComponent } from "./prof-certification/prof-certification.component";
import { JobSkillComponent } from "./job-skill/job-skill.component";
import { LocationComponent } from "./location/location.component";
import { HospitalManagementComponent } from "./hospital-management/hospital-management.component";
import { EmployeeIdFormatComponent } from "./employee-id-format/employee-id-format.component";
import { TableModule } from "primeng/table";
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleActivitiesComponent } from './user-role-activities/user-role-activities.component';
import { StaffInfoComponent } from './staff-info/staff-info.component';
import { StaffInfoListComponent } from './staff-info-list/staff-info-list.component';
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { CountryListComponent } from './country-list/country-list.component';
import { CountryComponent } from './country/country.component';

@NgModule({
  declarations: [
    SetupComponent,
    HighSchoolSubjectsComponent,
    AcademicGradeComponent,
    EmploymentTypeComponent,
    EmploymentLevelComponent,
    AcademicDisciplineComponent,
    EmploymentLevelComponent,
    AcademicQualificationComponent,
    JobGradeComponent,
    HmoComponent,
    GymWorkoutComponent,
    HighSchoolGradeComponent,
    LanguageComponent,
    JobTitleComponent,
    ProfCertificationComponent,
    ProfMembershipComponent,
    JobSkillComponent,
    LocationComponent,
    HospitalManagementComponent,
    EmployeeIdFormatComponent,
    UserRoleComponent,
    UserRoleActivitiesComponent,
    StaffInfoComponent,
    StaffInfoListComponent,
    CountryListComponent,
    CountryComponent,
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    MultiSelectModule,
    CalendarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
  ],
})
export class SetupModule {}
