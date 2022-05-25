import { Component, OnInit } from '@angular/core';
import { AdjustmentModel } from '../../../model/payroll.model';

@Component({
  selector: 'app-payroll-adjustment',
  templateUrl: './payroll-adjustment.component.html',
  styleUrls: ['./payroll-adjustment.component.css']
})
export class PayrollAdjustmentComponent implements OnInit {

  adjustmentData: AdjustmentModel[] = [
    {
      reference: '000459',
      empID: 'ABC0001',
      name: 'Sam White',
      description: 'Additional money',
      adjustmentType: 'Earning',
      amount: '$ 12, 000, 200.78',
      payDate: '30 Dec 2021',
      taxable: 'No',
      status: 'Approved',
    },
    {
      reference: '000459',
      empID: 'ABC0001',
      name: 'Sam White',
      description: 'Additional money',
      adjustmentType: 'Earning',
      amount: '$ 12, 000, 200.78',
      payDate: '30 Dec 2021',
      taxable: 'No',
      status: 'Pending',
    },
    {
      reference: '000459',
      empID: 'ABC0001',
      name: 'Sam White',
      description: 'Additional money',
      adjustmentType: 'Earning',
      amount: '$ 12, 000, 200.78',
      payDate: '30 Dec 2021',
      taxable: 'No',
      status: 'Pending',
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
