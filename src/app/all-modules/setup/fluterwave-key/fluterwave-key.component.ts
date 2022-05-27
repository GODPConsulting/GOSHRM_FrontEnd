import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-fluterwave-key',
  templateUrl: './fluterwave-key.component.html',
  styleUrls: ['./fluterwave-key.component.css']
})
export class FluterwaveKeyComponent implements OnInit {
  formTitle: string = 'Flutterwave Key Setup';
  paymentSetupForm: FormGroup;
  updatepaymentSetupForm: FormGroup;
  setups: any[] = [];

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService:  CommonService
  ) { }

  ngOnInit() {
    this.initPaymentForm();
    this.initUpdatePaymentForm()
    this.getPaymentSetup();
  }

  getPaymentSetup() {
    this.loadingService.show();
      this.commonService.getAllPaymentSetups().subscribe(
        (data) => {
          this.loadingService.hide()
          this.setups = data.response;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  getPaymentType(type: number) {
      let paymentType;
      switch (type) {
        case 1:
          paymentType = "Flutterwave Setup";
          break;
        case 2:
          paymentType = "Paystack Setup";
          break;
        case 3:
          paymentType = "Paypal Setup";
          break;
      }
      return paymentType;
  }

  initPaymentForm() {
    this.paymentSetupForm = this.fb.group({
      setup: this.fb.array([
        this.fb.group({
          paymentSetUpId: [0],
          secretKey: [""],
          publicKey: [""],
          paymentType: [0]
        })
      ])
    })
  }

  initUpdatePaymentForm() {
    this.updatepaymentSetupForm = this.fb.group({
        paymentSetUpId: [0],
        secretKey: [""],
        publicKey: [""],
        paymentType: [0]
    })
  }

  get newForm(): FormArray {
    return this.paymentSetupForm.get('setup') as FormArray
  }

  addMorePayment() {
    let setup = this.fb.group(new setupDTO());
		this.newForm.push(setup);
  }

  openModal() {
    $("#add-payment").modal("show");
    this.initPaymentForm();
  }

  closeModal() {
    $("#add-payment").modal("hide");
  }

  openUpdateModal(setup) {
    $("#update-payment").modal("show");
    this.updatepaymentSetupForm = this.fb.group({
        paymentSetUpId: [setup.paymentSetUpId],
        secretKey: [setup.secretKey],
        publicKey: [setup.publicKey],
        paymentType: [setup.paymentType]
    })
  }

  closeUpdateModal() {
    $("#update-payment").modal("hide");
  }
  
  submit() {
    this.loadingService.show();
    const payload = this.paymentSetupForm.value;
    this.commonService.addPaymentSetup(payload.setup).subscribe(
        data => {
          this.loadingService.hide();
          // console.log(data);
            if(data.status.isSuccessful) {
              let message = data.status.message.friendlyMessage;
              this.closeModal();
              this.initPaymentForm();
              this.getPaymentSetup();
              swal.fire("GOS FINANCIAL", message, "success");
            } else {
              swal.fire("GOS FINANCIAL", 'An error occurred!', "error");
            }
        },
        err => {
            this.loadingService.hide();
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  updateSetup() {
    this.loadingService.show();
    const payload = this.updatepaymentSetupForm.value;
    this.commonService.addPaymentSetup([payload]).subscribe(
        data => {
          this.loadingService.hide();
          // console.log(data);
            if(data.status.isSuccessful) {
              let message = data.status.message.friendlyMessage;
              this.closeUpdateModal();
              this.getPaymentSetup();
              swal.fire("GOS FINANCIAL", message, "success");
            } else {
              swal.fire("GOS FINANCIAL", 'An error occurred!', "error");
            }
        },
        err => {
            this.loadingService.hide();
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }
}

export class setupDTO {
  paymentSetUpId = 0;
  secretKey = "";
  publicKey = "";
  paymentType = 0;
}
