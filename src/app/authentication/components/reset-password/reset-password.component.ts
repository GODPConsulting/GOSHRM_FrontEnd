import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-registration',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm!: FormGroup;
  public isLoggingIn: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  constructor(
    private _base: BaseComponent,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initResetPasswordForm();
  }

  public initResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }

  public submit(): void {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.isLoggingIn = false;
      this._base.openSnackBar('Password reset successfully', 'success');
    }, 3000);
  }

}
