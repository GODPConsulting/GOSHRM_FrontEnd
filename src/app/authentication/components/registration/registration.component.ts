import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { HelperService } from '@core/services/healper.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!: FormGroup;
  public isRegistering: boolean = false;
  public isRegisteringFormSubmitted: boolean = false;
  public showPassword: boolean = false;
  public isError: boolean = false;
  public showConfirmPassword: boolean = false;
  public error_message: string = '';
  public findUser: string = 'participant';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private _helper: HelperService,
  ) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registrationForm = this.fb.group({
        name: ['', Validators.required],
        email: ["", Validators.compose([Validators.required, Validators.email])],
        physicalAddress: [''],
        phoneNumber: [''],
        companyId: [0],
        password: ['', Validators.required],
    })
  }

  public register(): void {
    this._helper.startSpinner();
    this.isRegistering = true;
    this.isRegisteringFormSubmitted = true;
    const payload = this.registrationForm.value;
    if(this.registrationForm.valid) {
      this.auth.register(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.isRegistering = false;
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isRegisteringFormSubmitted = true;
            this._helper.triggerSucessAlert('Registration scuccessful!!!')
            this.router.navigate(['/authentication/confirmation']);
          } else {
            this._helper.stopSpinner();
            this.isError = true;
            this.error_message = res?.status?.message?.friendlyMessage
          }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.isRegistering = false;
          this.isRegisteringFormSubmitted = true;
          this.error_message = error?.error?.message
        }
      })
    }  else {
      this._helper.stopSpinner();
      this.isRegistering = false;
      this.isError = true;
      this.error_message = "Kindly fill the form correctly"
    }
  }

}
