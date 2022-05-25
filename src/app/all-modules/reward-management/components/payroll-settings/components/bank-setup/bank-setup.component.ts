import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BankSetupModel } from 'src/app/all-modules/reward-management/model/payroll.model';
import { threadId } from 'worker_threads';
declare const $: any;

@Component({
  selector: 'app-bank-setup',
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.css']
})
export class BankSetupComponent implements OnInit {

  bankSetupModelData: BankSetupModel[] = [
    {
      bankName: 'Basic Salary',
      sortCode: 'Yes'
    },
    {
      bankName: 'Basic Salary',
      sortCode: 'Yes'
    },
    {
      bankName: 'Basic Salary',
      sortCode: 'Yes'
    }
  ];
  addMoreFormGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {  
    this.addMoreFormGroup = this.fb.group({
      bankDetails: this.fb.array([this.newBankDetails()])
    });
  
  }

  get banks(): FormArray {
    return this.addMoreFormGroup.get('bankDetails') as FormArray;
  }

  newBankDetails(): FormGroup{
    return this.fb.group({
      bankName: '',
      sortCode: ''
    })
  }

  addBankDetails(){
    this.banks.push(this.newBankDetails());
  }

  deleteBankdetails(i: number){
    this.banks.removeAt(i);
  }


  openModal() {

    $("#add-earnings").modal("show");
  }

  closeModal() {
    $("#add-earnings").modal("hide");
  }

}
