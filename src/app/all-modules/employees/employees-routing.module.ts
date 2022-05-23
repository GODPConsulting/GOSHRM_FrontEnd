import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeesComponent } from "./employees.component";
import { EmployeeViewsComponent } from "./all-employees/employee-views/employee-views.component";
import { EmployeeProfileComponent } from "./all-employees/employee-profile/employee-profile.component";
import { EmployeeFormComponent } from "./all-employees/employee-form/employee-form.component";
import { LayoutComponent } from "./all-employees/employee-management/layout/layout.component";
import { PersonalDetailsComponent } from "./all-employees/employee-management/personal-details/personal-details.component";

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
        path: "employeeprofile",
        component: EmployeeProfileComponent,
      },
      {
        path: "employee-form",
        component: EmployeeFormComponent,
      },
      {
        path: "employee-form/:editUser",
        component: EmployeeFormComponent,
      },
      {
        path: "employee-management",
        component: LayoutComponent,
        children: [
          {
          path: '',
          component: PersonalDetailsComponent
          }
        ]
      },
    ],
    runGuardsAndResolvers: "always",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
