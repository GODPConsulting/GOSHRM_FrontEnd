import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@core/base/base/base.component';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
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
  public loggedInUser: any;
  public userType: any;

  constructor(
    private _security: SecurityService,
    private _base: BaseComponent,
    private fb: FormBuilder,
    private _currentService: CurrentUserService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    if(this.loggedInUser.customerTypeId == 1) {
      this.userType = CreatedByType.provider
    } else if(this.loggedInUser.customerTypeId == 2) {
      this.userType = CreatedByType.instructor
    } else {
      this.userType = CreatedByType.participant
    }
    this.initPasswordForm();
  }

  initPasswordForm() {
    this.changePasswordForm = this.fb.group({
      type: [this.userType],
      userId: [this.loggedInUser.userId],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  submit() {
    this.securityFormSubmitted = true;
    this._helper.startSpinner();
    const payload = this.changePasswordForm.value;
    console.log(payload);
    this.sub.add(
      this._security.updateSecuritySetup(payload).subscribe({
        next: (res: ResponseModel<Security>) => {
          this.securityFormSubmitted = false;
          this._helper.stopSpinner();
          console.log(res);
          this.changePasswordForm.reset();
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: any) => {
          this.securityFormSubmitted = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

}
