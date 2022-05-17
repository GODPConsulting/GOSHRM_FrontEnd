import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import { LoadingService } from 'src/app/services/loading.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-fluterwave-key',
  templateUrl: './fluterwave-key.component.html',
  styleUrls: ['./fluterwave-key.component.css']
})
export class FluterwaveKeyComponent implements OnInit {
  formTitle: string = 'Flutterwave Key Setup';
  okraForm: FormGroup;
  crcForm: FormGroup;
  flutterForm: FormGroup;
  sendChampForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.getKeysList();
    this.okraForm = this.fb.group({
      okraKeysId: 0,
      secret_keys: ['',],
      public_keys: [''],
      useOkra: false,
      client_Token: ['']
    });
    this.crcForm = this.fb.group({
      crcId: 0,
      username: ['',],
      password: [''],
      useCRC: false
    });
    this.flutterForm = this.fb.group({
      flutterWaveKeysId: 0,
      secret_keys: ['',],
      public_keys: [''],
      useFlutterWave: false
    });
    this.sendChampForm = this.fb.group({
      sendChampId: 0,
      privateKey: ['',],
      publicKey: [''],
      senderName: [''],
      route: 0,
      useSendChamp: false
    });
  }

  goBack() {

  }
  getKeysList() {

    // return this.glMappingService.getFlutterKeys().subscribe(data => {
    //   // console.log(data);
    //   const row = data
    //   this.okraForm = this.fb.group({
    //     okraKeysId: row.okraKeys.okraKeysId,
    //     secret_keys: [row.okraKeys.secret_keys],
    //     public_keys: [row.okraKeys.public_keys],
    //     useOkra: [row.okraKeys.useOkra],
    //     client_Token: [row.okraKeys.client_Token]
    //   })
    //   this.crcForm = this.fb.group({
    //     crcId: row.crcKeys.crcId,
    //     username: [row.crcKeys.username],
    //     password: [row.crcKeys.password],
    //     useCRC: [row.crcKeys.useCRC]
    //   })
    //   this.flutterForm = this.fb.group({
    //     flutterWaveKeysId: row.flutterKeys.flutterWaveKeysId,
    //     secret_keys: [row.flutterKeys.secret_keys],
    //     public_keys: [row.flutterKeys.public_keys],
    //     useFlutterWave: [row.flutterKeys.useFlutterWave]
    //   })
    //   this.sendChampForm = this.fb.group({
    //     sendChampId: row.sendChampKeys.sendChampId,
    //     privateKey: [row.sendChampKeys.privateKey],
    //     publicKey: [row.sendChampKeys.publicKey],
    //     senderName: [row.sendChampKeys.senderName],
    //     route: [row.sendChampKeys.route],
    //     useSendChamp: [row.sendChampKeys.useSendChamp]
    //   })
    // }, err => {

    // })
  }
  submit() {
    const payload = {
      okraKeys: this.okraForm.value,
      crcKeys: this.crcForm.value,
      flutterKeys: this.flutterForm.value,
      sendChampKeys: this.sendChampForm.value
    }
    // console.log(payload)
    // if (!payload.secret_keys) {
    //   return swal.fire('Error', 'Secret keys is required', 'error')
    // }
    // if (!payload.public_keys) {
    //   return swal.fire('Error', 'Public keys is required', 'error')
    // }

    // return this.glMappingService.updateFlutterKeys(payload).subscribe(res => {

    //   const message = res.status.message.friendlyMessage;
    //   if (res.status.isSuccessful) {
    //     swal.fire('GOS FINANCIAL', message, 'success')
    //   } else {
    //     swal.fire('GOS FINANCIAL', message, 'error')
    //   }
    // }, err => {

    //   const message = err.status.message.friendlyMessage;
    //   swal.fire('GOS FINANCIAL', message, 'error')
    // })
  }
}
