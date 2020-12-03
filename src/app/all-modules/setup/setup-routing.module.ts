import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JobgradesComponent} from "./jobgrades/jobgrades.component";
import {SetupComponent} from "./setup.component";
import {HighSchoolSubjectComponent} from "./high-school-subject/high-school-subject.component";
import {HighSchoolSubjectsComponent} from "./high-school-subjects/high-school-subjects.component";

const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
    children: [
      {
        path: 'jobgrades',
        component: JobgradesComponent
      },
      {
        path: 'high-school-subjects',
        component: HighSchoolSubjectsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
