import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { JobgradesComponent } from "./jobgrades/jobgrades.component";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
import { EmploymentLevelComponent } from './employment-level/employment-level.component';
import { AcademicDisciplineComponent } from './academic-discipline/academic-discipline.component';
import { AcademicQualificationComponent } from './academic-qualification/academic-qualification.component';
import { HmoComponent } from "./hmo/hmo.component";

const routes: Routes = [
  {
    path: "",
    component: SetupComponent,
    children: [
      {
        path: "jobgrades",
        component: JobgradesComponent,
      },
      {
        path: "high-school-subjects",
        component: HighSchoolSubjectsComponent,
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
        path: "employment-level",
        component: EmploymentLevelComponent,
      },
      {
        path: "hmo",
        component: HmoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
