import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
<<<<<<< HEAD
import { EmploymentLevelComponent } from "./employment-level/employment-level.component";
import { JobGradeComponent } from "./job-grade/job-grade.component";
=======
import { AcademicDisciplineComponent } from './academic-discipline/academic-discipline.component';
import { EmploymentLevelComponent } from "./employment-level/employment-level.component";
import { HmoComponent } from "./hmo/hmo.component";
>>>>>>> dev

const routes: Routes = [
  {
    path: "",
    component: SetupComponent,
    children: [
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
<<<<<<< HEAD
        path: "employment-level",
        component: EmploymentLevelComponent,
=======
        path: 'employment-level',
        component: EmploymentLevelComponent
      },
      {
        path: 'academic-discipline',
        component: AcademicDisciplineComponent
      },
      {
        path: "hmo",
        component: HmoComponent,
>>>>>>> dev
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
