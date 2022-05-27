import { Component, OnInit } from '@angular/core';
import { AjustPayrollModel, EmployeePayrollModel } from '../../../model/payroll.model';
declare const $: any;

@Component({
  selector: 'app-payroll-data',
  templateUrl: './payroll-data.component.html',
  styleUrls: ['./payroll-data.component.css']
})
export class PayrollDataComponent implements OnInit {

  payrollData: EmployeePayrollModel[] = [
    {
    employee: 'Brooklyn Simmons',
    jobTitle: 'Software Engineer',
    netPay:  '$ 12, 000, 200.78',
    datePaid: '30 Dec 2021',
    PaymentStatus: 'Paid'
    },
    {
    employee: 'Cameron Williamson',
    jobTitle: 'Architectural and Engineering',
    netPay:  '$ 12, 000, 200.78',
    datePaid: '',
    PaymentStatus: 'Unpaid'
    },
    {
    employee: 'Leslie Alexander',
    jobTitle: 'FrontDesk Officer',
    netPay:  '$ 12, 000, 200.78',
    datePaid: '30 Dec 2021',
    PaymentStatus: 'Paid'
    }
  ];

  dataToAdjust: AjustPayrollModel[] = [
    {
    salaryItem: 'Brooklyn Simmons',
    type: 'Earning',
    amount: '$ 12, 000, 200.78',
    taxable: 'Yes'
    },
    {
    salaryItem: 'Cameron Williamson',
    type: 'Earning',
    amount: '$ 12, 000, 200.78',
    taxable: 'Yes'
    },
    {
    salaryItem: 'Leslie Alexander',
    type: 'Earning',
    amount: '$ 12, 000, 200.78',
    taxable: 'No'
    },
    {
    salaryItem: 'Leslie Alexander',
    type: 'Earning',
    amount: '$ 12, 000, 200.78',
    taxable: 'Yes'
    },
    {
    salaryItem: 'Leslie Alexander',
    type: 'Earning',
    amount: '$ 12, 000, 200.78',
    taxable: 'No'
    },
    {
    salaryItem: 'Leslie Alexander',
    type: 'Deduction',
    amount: '$ 12, 000, 200.78',
    taxable: 'No'
    },
    {
    salaryItem: 'Leslie Alexander',
    type: 'Deduction',
    amount: '$ 12, 000, 200.78',
    taxable: 'Yes'
    },
  ]

  selectedSpan: string = 'edit';
  selectedElement!: number;

  constructor() { }

  ngOnInit(): void {
  }

  displaySpan(span: string, id: number){
    this.selectedSpan = span;
    this.selectedElement = id;
  }

  openModal() {

    $("#adjust-payroll").modal("show");
  }

  closeModal() {
    $("#adjust-payroll").modal("hide");
  }

}
