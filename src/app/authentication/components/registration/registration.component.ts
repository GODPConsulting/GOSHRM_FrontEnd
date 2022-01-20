// import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterResponseDTO } from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
import { ResponseModel } from 'app/models/response.model';
// import { CurrentUserService  } from '@core/services/current-user.service'

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    // private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registrationForm = this.fb.group({
        full_Name: ['', Validators.required],
        email_Address: ["", Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required],
    })
  }

  public register(): void {
    this.isRegistering = true;
    this.isRegisteringFormSubmitted = true;
    if(this.registrationForm.valid) {
      this.auth.register(this.registrationForm.value).subscribe({
        next: (res: ResponseModel<RegisterResponseDTO>) => {
          console.log(res);
          this.isRegistering = false;
          this.isRegisteringFormSubmitted = true;
          // this._current.storeUserCredentials(res)
          this.router.navigate(['/authentication/confirmation']);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.isRegistering = false;
          this.isRegisteringFormSubmitted = true;
          this.error_message = error?.error?.message
        }
      })
    }  else {
      this.isRegistering = false;
      this.isError = true;
      this.error_message = "Kindly fill the form correctly"
    }
  }

}
