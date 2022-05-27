import { Component, OnInit } from '@angular/core';
import { PayrolltemSettingsModel } from 'src/app/all-modules/reward-management/model/payroll.model';
declare const $: any;

@Component({
  selector: 'app-earning-items',
  templateUrl: './earning-items.component.html',
  styleUrls: ['./earning-items.component.css']
})
export class EarningItemsComponent implements OnInit {

  payrollItemSettingsData: PayrolltemSettingsModel[] = [
    {
      payslipItem: 'Basic Salary',
      taxable: 'Yes',
      type: 'Fixed',
      amount: '$ 12, 000, 200.78',
      attendanceBased: 'No',
      active: 'True',
      position: 1
    },
    {
      payslipItem: 'Basic Salary',
      taxable: 'Yes',
      type: 'Fixed',
      amount: '$ 12, 000, 200.78',
      attendanceBased: 'No',
      active: 'True',
      position: 1
    },
    {
      payslipItem: 'Basic Salary',
      taxable: 'Yes',
      type: 'Fixed',
      amount: '$ 12, 000, 200.78',
      attendanceBased: 'No',
      active: 'True',
      position: 1
    },
    {
      payslipItem: 'Basic Salary',
      taxable: 'Yes',
      type: 'Fixed',
      amount: '$ 12, 000, 200.78',
      attendanceBased: 'No',
      active: 'True',
      position: 1
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  openModal() {

    $("#add-earnings").modal("show");
  }

  closeModal() {
    $("#add-earnings").modal("hide");
  }

}
