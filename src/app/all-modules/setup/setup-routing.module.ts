import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
import { JobGradeComponent } from "./job-grade/job-grade.component";
import { AcademicDisciplineComponent } from "./academic-discipline/academic-discipline.component";
import { EmploymentLevelComponent } from "./employment-level/employment-level.component";
import { AcademicQualificationComponent } from './academic-qualification/academic-qualification.component';
import { HmoComponent } from "./hmo/hmo.component";
import { HighSchoolGradeComponent } from './high-school-grade/high-school-grade.component';

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
        path: 'employment-level',
        component: EmploymentLevelComponent
      },
      {
        path: 'academic-discipline',
        component: AcademicDisciplineComponent
      },
      {
        path: 'academic-qualification',
        component: AcademicQualificationComponent
      },
      {
        path: "hmo",
        component: HmoComponent,
      },
      {
        path: "high-school-grade",
        component: HighSchoolGradeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
