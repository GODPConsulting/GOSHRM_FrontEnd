import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePayrollComponent } from './employee-payroll.component';
import { EmployeePayrollRoutingModule } from './employee-payroll-routing.module';
import { PayrollDataComponent } from './payroll-data/payroll-data.component';
import { PayrollAdjustmentComponent } from './payroll-adjustment/payroll-adjustment.component';



@NgModule({
  declarations: [EmployeePayrollComponent, 
    PayrollDataComponent, 
    PayrollAdjustmentComponent
    ],
  imports: [
    CommonModule, 
    EmployeePayrollRoutingModule
  ]
})
export class EmployeePayrollModule { }
