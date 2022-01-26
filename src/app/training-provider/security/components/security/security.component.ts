import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@core/base/base/base.component';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { Security } from '../../models/security.model';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public changePasswordForm!: FormGroup;
  public showCurrentPassword: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public isLoading: boolean = false;
  public spinner: boolean = false;
  public securityFormSubmitted: boolean = false;

  constructor(
    private _security: SecurityService,
    private _base: BaseComponent,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initPasswordForm();
  }

  initPasswordForm() {
    this.changePasswordForm = this.fb.group({
      old_Password: ['', Validators.required],
      new_Password: ['', Validators.required],
      confirm_Password: ['', Validators.required]
    })
  }

  submit(securitySetupTypeId: any) {
    this.securityFormSubmitted = true;
    const payload = this.changePasswordForm.value;
    payload.trainingProviderId = 1;
    payload.securitySetupTypeId = securitySetupTypeId;
    console.log(payload);
    this.sub.add(
      this._security.updateSecuritySetup(payload).subscribe({
        next: (res: ResponseModel<Security>) => {
          this.securityFormSubmitted = false;
          console.log(res);
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: any) => {
          this.securityFormSubmitted = false;
          console.log(error);
        },
      })
    );
  }

}
