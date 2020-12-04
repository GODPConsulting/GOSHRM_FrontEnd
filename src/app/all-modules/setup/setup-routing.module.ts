import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
<<<<<<< HEAD
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { JobGradeComponent } from "./job-grade/job-grade.component";
=======
import { JobgradesComponent } from "./jobgrades/jobgrades.component";
import { SetupComponent } from "./setup.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { EmploymentTypeComponent } from "./employment-type/employment-type.component";
import { EmploymentLevelComponent } from './employment-level/employment-level.component';
>>>>>>> dev

const routes: Routes = [
  {
    path: "",
    component: SetupComponent,
    children: [
      {
<<<<<<< HEAD
        path: "job-grade",
        component: JobGradeComponent,
      },
      {
        path: "high-school-subjects",
        component: HighSchoolSubjectsComponent,
      },
=======
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
        path: 'high-school-subjects',
        component: HighSchoolSubjectsComponent
      },
      {
        path: 'employment-level',
        component: EmploymentLevelComponent
      }
>>>>>>> dev
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
