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
        path: "hospital-management",
        component: HospitalManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
