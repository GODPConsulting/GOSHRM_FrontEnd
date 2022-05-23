export interface PayrollModel{
    dateGenerated: string;
    period: string;
    totalNetPay: string;
    approvalDate: string;
    approvalStatus: string;
    payrollStatus: string;
    noOfPaid: number;
    noofUnpaid: number;
}

export interface EmployeePayrollModel{
    employee: string;
    jobTitle: string;
    netPay: string;
    datePaid: string;
    PaymentStatus: string;
}

export interface AdjustmentModel{
    reference: string;
    empID: string;
    name: string;
    description: string;
    adjustmentType: string;
    amount: string;
    payDate: string;
    taxable: string;
    status: string;
}

export interface AjustPayrollModel{
    salaryItem: string;
    type: string;
    amount: string;
    taxable: string;
}

export interface PayrolltemSettingsModel{
    payslipItem: string;
    taxable: string;
    type: string;
    amount: string;
    attendanceBased: string;
    active: string;
    position: number;
}

export interface BankSetupModel{
    bankName: string;
    sortCode: string;
}

export interface ContributionsModel{
    employeeID: string;
    name: string;
    unitDept: string;
    location: string;
    contribution: string;
}

export interface sortByJobGradeModel{
    jobGrade: string;
    employee: number;
    employer: number;
}