import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BankSetupComponent } from "./components/payroll-settings/components/bank-setup/bank-setup.component";
import { ContributionsComponent } from "./components/payroll-settings/components/contributions/contributions.component";
import { EarningItemsComponent } from "./components/payroll-settings/components/earning-items/earning-items.component";
import { PayrollSettingsComponent } from "./components/payroll-settings/payroll-settings.component";
import { PayrollComponent } from "./components/payroll/payroll.component";


const routes: Routes = [
    {path: '',
    redirectTo: 'payroll',
    pathMatch: 'full'},

    {path: 'payroll',
    component: PayrollComponent},

    {path: 'payroll-settings',
    component: PayrollSettingsComponent,
    children: [
      { path: '',
        redirectTo: 'earning-items',
        pathMatch: 'full'},
      {
        path: 'earning-items',
        component: EarningItemsComponent
      },
      {
        path: 'bank-setup',
        component: BankSetupComponent
      },
      {
        path: 'contributions',
        component: ContributionsComponent
      }
    ]},

    {path: 'employee-payroll',
    loadChildren: () =>
    import("./components/employee-payroll/employee-payroll.module").then((m) => m.EmployeePayrollModule),
}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })


export class RewardManagementRoutingModule {}