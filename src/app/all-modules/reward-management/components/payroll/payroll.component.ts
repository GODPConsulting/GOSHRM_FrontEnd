import { Component, OnInit } from '@angular/core';
import { PayrollModel } from '../../model/payroll.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {

  payrollData: PayrollModel[] = [
    {
      dateGenerated : '21 Nov 2022',
      period : "30 Dec 2021 - 30 Jan 2022",
      totalNetPay : "$ 12, 000, 200.78",
      approvalDate : "30 Dec 2021",
      approvalStatus: "Approved",
      payrollStatus : "Open",
      noOfPaid : 100,
      noofUnpaid : 65
    },
    {
      dateGenerated : '21 Nov 2022',
      period : "30 Dec 2021 - 30 Jan 2022",
      totalNetPay : "$ 12, 000, 200.78",
      approvalDate : "30 Dec 2021",
      approvalStatus: "Approved",
      payrollStatus : "Lock",
      noOfPaid : 100,
      noofUnpaid : 65
    },
    {
      dateGenerated : '21 Nov 2022',
      period : "30 Dec 2021 - 30 Jan 2022",
      totalNetPay : "$ 12, 000, 200.78",
      approvalDate : "30 Dec 2021",
      approvalStatus: "Approved",
      payrollStatus : "Lock",
      noOfPaid : 100,
      noofUnpaid : 65
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
