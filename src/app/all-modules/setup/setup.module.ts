import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SetupRoutingModule } from "./setup-routing.module";
import { SetupComponent } from "./setup.component";
import { JobgradesComponent } from "./jobgrades/jobgrades.component";
import { HighSchoolSubjectComponent } from "./high-school-subject/high-school-subject.component";
import { HighSchoolSubjectsComponent } from "./high-school-subjects/high-school-subjects.component";
import { DataTablesModule } from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpTokenInterceptor} from "../../services/http.interceptor.service";
import { EmploymentTypeComponent } from './employment-type/employment-type.component';

@NgModule({
  declarations: [
    SetupComponent,
    JobgradesComponent,
    HighSchoolSubjectComponent,
    HighSchoolSubjectsComponent,
    EmploymentTypeComponent
  ],
  imports: [CommonModule, SetupRoutingModule, DataTablesModule, ReactiveFormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ]
})
export class SetupModule {}
