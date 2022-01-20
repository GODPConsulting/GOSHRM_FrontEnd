import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPassswordDTO } from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
import { ResponseModel } from 'app/models/response.model';
// import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm!: FormGroup;
  public isLoading: boolean = false;
  public emailFormSubmitted: boolean = false;
  public isError: boolean = false;
  public err_message: string = '';

  constructor(
    // private _base: BaseComponent,
    private fb: FormBuilder,
    private _router: Router,
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email_Address: ["", Validators.compose([Validators.required, Validators.email])],
    })
  }

  public submit(): void {
    this.isLoading = true;
    this.emailFormSubmitted = true;
    if (this.forgotPasswordForm.valid) {
      this._auth.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res: ResponseModel<ForgotPassswordDTO>) => {
          this.isLoading = false;
          this.emailFormSubmitted = true;
          this._router.navigate(['authentication/reset-password']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.emailFormSubmitted = true;
          this.err_message = error?.error?.message;
        },
      });
    } else {
      this.isLoading = false;
      this.isError = true;
      this.err_message = "Kindly fill the form correctly"
    }
  }

}
