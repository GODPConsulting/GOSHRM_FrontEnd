import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeesComponent } from "./employees.component";
import { EmployeeViewsComponent } from "./all-employees/employee-views/employee-views.component";
import { EmployeeProfileComponent } from "./all-employees/employee-profile/employee-profile.component";
import { EmployeeFormComponent } from "./all-employees/employee-form/employee-form.component";

const routes: Routes = [
  {
    path: "",
    component: EmployeesComponent,
    children: [
      {
        path: "employeeviews",
        component: EmployeeViewsComponent,
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
