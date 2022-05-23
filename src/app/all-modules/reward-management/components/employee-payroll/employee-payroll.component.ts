import { Component, OnInit } from '@angular/core';
declare const $: any;


@Component({
  selector: 'app-employee-payroll',
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.css']
})
export class EmployeePayrollComponent implements OnInit {
  currentPage: string = 'Employee Payroll';

  constructor() { }

  ngOnInit(): void {
  }
  switchPage(page: string){
    this.currentPage = page;
  }

  openModal() {

    $("#adjust-payroll").modal("show");
  }

  closeModal() {
    $("#adjust-payroll").modal("hide");
  }


}
