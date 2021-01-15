import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeesComponent } from "./employees.component";
import { EmployeePageContentComponent } from "./all-employees/employee-page-content/employee-page-content.component";
import { EmployeeListComponent } from "./all-employees/employee-list/employee-list.component";
import { EmployeeProfileComponent } from "./all-employees/employee-profile/employee-profile.component";
import { EmployeeFormComponent } from "./all-employees/employee-form/employee-form.component";

const routes: Routes = [
  {
    path: "",
    component: EmployeesComponent,
    children: [
      {
        path: "employeepage",
        component: EmployeePageContentComponent,
      },
      {
        path: "employeelist",
        component: EmployeeListComponent,
      },
      {
        path: "employeeprofile",
        component: EmployeeProfileComponent,
      },
      {
        path: "employee-form",
        component: EmployeeFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
