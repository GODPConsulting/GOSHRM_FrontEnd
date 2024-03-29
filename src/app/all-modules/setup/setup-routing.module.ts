import { ProfMembershipComponent } from "./prof-membership/prof-membership.component";
import { LanguageComponent } from "./language/language.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
import { JobGradeComponent } from "./job-grade/job-grade.component";
import { AcademicDisciplineComponent } from "./academic-discipline/academic-discipline.component";
import { EmploymentLevelComponent } from "./employment-level/employment-level.component";
import { AcademicQualificationComponent } from "./academic-qualification/academic-qualification.component";
import { HmoComponent } from "./hmo/hmo.component";

import { GymWorkoutComponent } from "./gym-workout/gym-workout.component";
import { HighSchoolGradeComponent } from "./high-school-grade/high-school-grade.component";
import { AcademicGradeComponent } from "./academic-grade/academic-grade.component";
import { JobTitleComponent } from "src/app/all-modules/setup/job-title/job-title.component";
import { ProfCertificationComponent } from "./prof-certification/prof-certification.component";
import { JobSkillComponent } from "./job-skill/job-skill.component";
import { LocationComponent } from "./location/location.component";
import { HospitalManagementComponent } from "./hospital-management/hospital-management.component";
import { EmployeeIdFormatComponent } from "./employee-id-format/employee-id-format.component";
import { UserRoleComponent } from "./user-role/user-role.component";
import { UserRoleActivitiesComponent } from "./user-role-activities/user-role-activities.component";
import { StaffInfoListComponent } from "./staff-info-list/staff-info-list.component";
import { StaffInfoComponent } from "./staff-info/staff-info.component";
import { CountryListComponent } from "./country-list/country-list.component";
import { CountryComponent } from "./country/country.component";
import { StateListComponent } from "./state-list/state-list.component";
import { StateComponent } from "./state/state.component";
import { CityListComponent } from "./city-list/city-list.component";
import { CityComponent } from "./city/city.component";
import { CurrencyListComponent } from "./currency-list/currency-list.component";
import { CurrencyComponent } from "./currency/currency.component";
import { EmailconfigListComponent } from "./emailconfig-list/emailconfig-list.component";
import { EmailconfigComponent } from "./emailconfig/emailconfig.component";
import { CompanyStructureDefinitionListComponent } from "./company-structure-definition-list/company-structure-definition-list.component";
import { CompanyStructureDefinitionComponent } from "./company-structure-definition/company-structure-definition.component";
import { CompanyStructureListComponent } from "./company-structure-list/company-structure-list.component";
import { CompanyStructureComponent } from "./company-structure/company-structure.component";
import { DocumentTypeComponent } from "./document-type/document-type.component";
import { FluterwaveKeyComponent } from "./fluterwave-key/fluterwave-key.component";
import { OrganizationSetupComponent } from "./organization-setup/organization-setup.component";
import { WorkforceBudgetComponent } from "./organization-setup/workforce-budget/workforce-budget.component";
import { WorkforcePlanComponent } from "./organization-setup/workforce-plan/workforce-plan.component";

const routes: Routes = [
  {
    path: "",
    component: SetupComponent,
    children: [
      {
        path: "employee-id-format",
        component: EmployeeIdFormatComponent,
      },
      {
        path: "language",
        component: LanguageComponent,
      },
      {
        path: "prof-membership",
        component: ProfMembershipComponent,
      },
      {
        path: "job-grade",
        component: JobGradeComponent,
      },
      {
        path: "employment-type",
        component: EmploymentTypeComponent,
      },
      {
        path: "high-school-subjects",
        component: HighSchoolSubjectsComponent,
      },
      {
        path: "employment-level",
        component: EmploymentLevelComponent,
      },
      {
        path: "academic-discipline",
        component: AcademicDisciplineComponent,
      },
      {
        path: "academic-qualification",
        component: AcademicQualificationComponent,
      },
      {
        path: "hmo",
        component: HmoComponent,
      },
      {
        path: "gym-workout",
        component: GymWorkoutComponent,
      },
      {
        path: "high-school-grade",
        component: HighSchoolGradeComponent,
      },
      {
        path: "academic-grade",
        component: AcademicGradeComponent,
      },
      {
        path: "job-title",
        component: JobTitleComponent,
      },
      {
        path: "job-title/:id",
        component: JobSkillComponent,
      },
      {
        path: "prof-certification",
        component: ProfCertificationComponent,
      },
      {
        path: "job-skill",
        component: JobSkillComponent,
      },
      {
        path: "location",
        component: LocationComponent,
      },
      {
        path: "flutterwave-transfer",
        component: FluterwaveKeyComponent,
      },
      {
        path: "hospital-management",
        component: HospitalManagementComponent,
      },
      {
        path: "user-role",
        component: UserRoleComponent,
      },
      {
        path: "user-role-activity",
        component: UserRoleActivitiesComponent,
      },
      {
        path: "staff-info-list",
        component: StaffInfoListComponent,
      },
      {
        path: "staff-info",
        component: StaffInfoComponent,
      },
      {
        path: "country-list",
        component: CountryListComponent,
      },
      {
        path: "country",
        component: CountryComponent,
      },
      {
        path: "state-list",
        component: StateListComponent,
      },
      {
        path: "state",
        component: StateComponent,
      },
      {
        path: "city-list",
        component: CityListComponent,
      },
      {
        path: "city",
        component: CityComponent,
      },
      {
        path: "currency-list",
        component: CurrencyListComponent,
      },
      {
        path: "currency",
        component: CurrencyComponent,
      },
      {
        path: "document-type",
        component: DocumentTypeComponent,
      },
      {
        path: "emailconfig-list",
        component: EmailconfigListComponent,
      },
      {
        path: "email-config",
        component: EmailconfigComponent,
      },
      {
        path: "company-structure",
        component: CompanyStructureComponent,
      },
      {
        path: "company-structure-list",
        component: CompanyStructureListComponent,
      },
      {
        path: "company-structure-definition",
        component: CompanyStructureDefinitionComponent,
      },
      {
        path: "company-structure-definition-list",
        component: CompanyStructureDefinitionListComponent,
      },
      {
        path: "organization-setup",
        component: OrganizationSetupComponent,
        children: [
          {
            path: '',
            redirectTo: 'workfoce-budget'
          },
          {
            path: 'workfoce-budget',
            component: WorkforceBudgetComponent
          },
          {
            path: 'workforce-plan',
            component: WorkforcePlanComponent
          }
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
