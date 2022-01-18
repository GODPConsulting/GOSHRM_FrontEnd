import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public forgotPasswordForm!: FormGroup;
  public isLoggingIn: boolean = false;

  constructor(
    private _base: BaseComponent,
    private fb: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    })
  }

  public submit(): void {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.isLoggingIn = false;
      this._base.openSnackBar('Check your email for reset link', 'success');
    }, 3000);
    this._router.navigate(['/authentication/reset-password'])
  }

}
