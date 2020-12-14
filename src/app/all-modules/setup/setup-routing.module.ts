import { ProfMembershipComponent } from './prof-membership/prof-membership.component';
import { LanguageComponent } from './language/language.component';
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
import { JobDetailComponent } from "src/app/all-modules/setup/job-detail/job-detail.component";
import { ProfCertificationComponent } from "./prof-certification/prof-certification.component";


const routes: Routes = [
  {
    path: "",
    component: SetupComponent,
    children: [
  
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
        path: "job-detail",
        component: JobDetailComponent,
      },
      {
        path: "prof-certification",
        component: ProfCertificationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
