import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import swal from 'sweetalert2';
import { PaymentSetupService } from '../../services/payment-setup.service';

@Component({
  selector: 'app-payment-setup',
  templateUrl: './payment-setup.component.html',
  styleUrls: ['./payment-setup.component.scss']
})
export class PaymentSetupComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public paymentOptions: string[] = ['None', 'Flutterwave', 'PayStack', 'Bankone'];
  public paymentForm!: FormGroup;
  public paymentFormSubmitted!: boolean;
  public error_message!: string;
  public paymentDetail: any[] = [];
  public selectedPayment: string = 'Flutterwave';
  public opened: boolean = false;
  public flutterwaveSetupForm!: FormGroup;
  public paystackSetupForm!: FormGroup;
  public bankoneSetupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _helper: HelperService,
    private _setup: PaymentSetupService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSilently();
    // this.paymentDetail?.forEach((item: any) => {
    //   if(item.type === 1){
    //     this.flutterwaveSetupForm.patchValue({
    //       id: item.id,
    //       secret: item.secret,
    //       key: item.key,
    //       type: item.type,
    //     });
    //   }
    //   else if(item.type === 2){
    //     this.paystackSetupForm.patchValue({
    //       id: item.id,
    //       secret: item.secret,
    //       key: item.key,
    //       type: item.type,
    //     });
    //   }
    //   else if(item.type === 3){
    //     this.bankoneSetupForm.patchValue({
    //       id: item.id,
    //       secret: item.secret,
    //       key: item.key,
    //       payrollCode: item.payrollCode,
    //       nonPayrollCode: item.nonPayrollCode,
    //       type: item.type,
    //     });
    //   }
    // });
  }


  public loadSilently(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._setup.getPaymentSetup().subscribe({
        next: (res: any) => {
         this._helper.stopSpinner();
          this.paymentDetail = res;
          this.initializeForm();
          // this.paymentDetail?.forEach((item: any) => {
          //   if(item.type === 1){
          //     this.flutterwaveSetupForm.patchValue({
          //       id: item.id,
          //       secret: item.secret,
          //       key: item.key,
          //       type: item.type,
          //     });
          //   }
          //   else if(item.type === 2){
          //     this.paystackSetupForm.patchValue({
          //       id: item.id,
          //       secret: item.secret,
          //       key: item.key,
          //       type: item.type,
          //     });
          //   }
          //   else if(item.type === 3){
          //     this.bankoneSetupForm.patchValue({
          //       id: item.id,
          //       secret: item.secret,
          //       key: item.key,
          //       payrollCode: item.payrollCode,
          //       nonPayrollCode: item.nonPayrollCode,
          //       type: item.type,
          //     });
          //   }
          // });
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  initializeForm(){
    this.flutterwaveSetupForm = this.fb.group({
      flutterwaveSetupId: [this.paymentDetail[0]?.flutterwaveSetupId ?? 0, Validators.required],
      key: [this.paymentDetail[0]?.key ?? "", Validators.required],
      value: [this.paymentDetail[0]?.value ?? "", Validators.required],
    });
    this.paystackSetupForm = this.fb.group({
      id: [0, Validators.required],
      secret: ["", Validators.required],
      key: ["", Validators.required],
      type: [2, Validators.required],
    });
    this.bankoneSetupForm = this.fb.group({
      id: [0, Validators.required],
      secret: ["", Validators.required],
      key: ["", Validators.required],
      payrollCode: ["", [Validators.required, Validators.maxLength(7)]],
      nonPayrollCode: ["", [Validators.required, Validators.maxLength(7)]],
      type: [3, Validators.required],
    });
  }

  // public checkForKeyEnter(event: KeyboardEvent): void {
  //   var key = event.key || event.keyCode;
  //   if (key == 'Enter' || key == 8) {
  //     this.addPaymentSetup();
  //   }
  // }

  public addPaymentSetup(type: number): void {
    let payload: any[] = [];
    switch(type){
      case 1:
        let flutterPayload = this.flutterwaveSetupForm.value;
        payload.push(flutterPayload);
      break;
      case 2:
      let paystackPayload = this.paystackSetupForm.value;
      payload.push(paystackPayload);
      break;
      case 3:
        let bankonePayload = this.bankoneSetupForm.value;
        payload.push(bankonePayload);
      break;
    }
    this.paymentFormSubmitted = true;
      this._helper.startSpinner();
        this._setup.addPaymentSetup(payload[0]).subscribe({
          next: (res: any) => {
            this._helper.stopSpinner();
            const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Payment configuraton saved Successfully!!!',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.loadSilently();
              } else {
                this.error_message = message;
              }
            this.paymentFormSubmitted = false;
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            this.paymentFormSubmitted = false;
            this.error_message = error?.error?.status.message.friendlyMessage;
          },
        });
  }

}
