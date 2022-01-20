import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponseDTO } from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
// import { CurrentUserService } from '@core/services/current-user.service';
// import { BaseComponent } from '@core/base/base/base.component';
import { ResponseModel } from 'app/models/response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoggingIn: boolean = false;
  public loginFormSubmitted: boolean = false;
  public showPassword: boolean = false;
  public err_message: string = '';
  public isError: boolean = false;
  constructor(
    // private _base: BaseComponent,
    private fb: FormBuilder,
    private router: Router,
    private _auth: AuthService,
    // private _current: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email_Address: ["", Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    })
  }


  public login(): void {
    this.isLoggingIn = true;
    this.loginFormSubmitted = true;
    if (this.loginForm.valid) {
      this._auth.login(this.loginForm.value).subscribe({
        next: (res: ResponseModel<LoginResponseDTO>) => {
          this.isLoggingIn = false;
          this.loginFormSubmitted = true;
          // this._current.storeUserCredentials(res?.response);
          this.router.navigate(['training-provider']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoggingIn = false;
          this.loginFormSubmitted = true;
          this.err_message = error?.error?.message;
        },
      });
    } else {
      this.isLoggingIn = false;
      this.isError = true;
      this.err_message = "Kindly fill the form correctly"
    }
  }
}
