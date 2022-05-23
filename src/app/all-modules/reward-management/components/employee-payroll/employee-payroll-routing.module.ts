import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeePayrollComponent } from "./employee-payroll.component";
import { PayrollAdjustmentComponent } from "./payroll-adjustment/payroll-adjustment.component";
import { PayrollDataComponent } from "./payroll-data/payroll-data.component";

const routes: Routes = [
    {path: '',
    component: EmployeePayrollComponent,
    children: [
      {
        path: '',
        component: PayrollDataComponent
      },
      {
        path: 'adjustment',
        component: PayrollAdjustmentComponent
      }
    ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class EmployeePayrollRoutingModule{}