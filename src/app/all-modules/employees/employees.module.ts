import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmployeesRoutingModule } from "./employees-routing.module";
import { EmployeesComponent } from "./employees.component";
import { AllEmployeesComponent } from "./all-employees/all-employees.component";
import { EmployeeViewsComponent } from "./all-employees/employee-views/employee-views.component";
import { EmployeeProfileComponent } from "./all-employees/employee-profile/employee-profile.component";

import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PickListModule } from "primeng/picklist";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "../../services/http.interceptor.service";
import { EmployeeFormComponent } from "./all-employees/employee-form/employee-form.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { IdentificationComponent } from "./all-employees/employee-profile/identification/identification.component";
import { HobbiesComponent } from "./all-employees/employee-profile/hobbies/hobbies.component";
import { AssetsComponent } from "./all-employees/employee-profile/assets/assets.component";
import { RefereeComponent } from "./all-employees/employee-profile/referee/referee.component";
import { ProfCertComponent } from "./all-employees/employee-profile/prof-cert/prof-cert.component";
import { DependentContactComponent } from "./all-employees/employee-profile/dependent-contact/dependent-contact.component";
import { CareerComponent } from "./all-employees/employee-profile/career/career.component";

import { SkillsComponent } from "./all-employees/employee-profile/skills/skills.component";
import { EmployeeHmoComponent } from "./all-employees/employee-profile/employee-hmo/employee-hmo.component";
import { RatingModule } from "ngx-bootstrap/rating";
import { HospitalComponent } from "./all-employees/employee-profile/hospital/hospital.component";
import { EmployeeGymComponent } from "./all-employees/employee-profile/employee-gym/employee-gym.component";

@NgModule({
  declarations: [
    EmployeesComponent,
    AllEmployeesComponent,
    EmployeeViewsComponent,
    EmployeeProfileComponent,
    EmployeeFormComponent,
    IdentificationComponent,
    HobbiesComponent,
    AssetsComponent,
    SkillsComponent,
    RefereeComponent,
    EmployeeHmoComponent,
    ProfCertComponent,
    DependentContactComponent,
    CareerComponent,
    HospitalComponent,
    EmployeeGymComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PickListModule,
    EmployeesRoutingModule,
    PickListModule,
    BsDatepickerModule.forRoot(),
    DataTablesModule,
    SharedModule,
    NgSelectModule,
    RatingModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
  ],
})
export class EmployeesModule {}
