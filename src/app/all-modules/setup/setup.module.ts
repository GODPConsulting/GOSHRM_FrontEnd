import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SetupRoutingModule } from "./setup-routing.module";
import { SetupComponent } from "./setup.component";
import { JobgradesComponent } from "./jobgrades/jobgrades.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { DataTablesModule } from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpTokenInterceptor} from "../../services/http.interceptor.service";
import { EmploymentTypeComponent } from './employment-type/employment-type.component';
import { AcademicDisciplineComponent } from './academic-discipline/academic-discipline.component';
import { EmploymentLevelComponent } from './employment-level/employment-level.component';
import {AppModule} from "../../app.module";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    SetupComponent,
    JobgradesComponent,
    HighSchoolSubjectComponent,
    HighSchoolSubjectsComponent,
    EmploymentTypeComponent,
    EmploymentLevelComponent,
    AcademicDisciplineComponent,
    EmploymentLevelComponent
  ],
  imports: [CommonModule, SetupRoutingModule, DataTablesModule, ReactiveFormsModule, SharedModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ]
})
export class SetupModule {}
