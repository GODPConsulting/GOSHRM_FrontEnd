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

@NgModule({
  declarations: [
    EmployeesComponent,
    AllEmployeesComponent,
    EmployeeViewsComponent,
    EmployeeProfileComponent,
    EmployeeFormComponent,
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
