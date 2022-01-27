import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { LoginResponseDTO } from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
import { CurrentUserService } from '@core/services/current-user.service';
// import { BaseComponent } from '@core/base/base/base.component';
// import { ResponseModel } from 'app/models/response.model';

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
  public profile: any;
  constructor(
    // private _base: BaseComponent,
    private fb: FormBuilder,
    private router: Router,
    private _auth: AuthService,
    private _current: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    })
  }


  public login(): void {
    this.isLoggingIn = true;
    this.loginFormSubmitted = true;
    const payload = this.loginForm.value;
    console.log(payload);
    if (this.loginForm.valid) {
      this._auth.login(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.isLoggingIn = false;
          if(res?.status.isSuccessful) {
            this.loginFormSubmitted = true;
            this._current.storeUserCredentials(res?.token);
            this.getProfile();
          } else {
            this.isError = true;
            this.err_message = res?.status?.message?.friendlyMessage
          }
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

  getProfile() {
    this._auth.getProfile().subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoggingIn = false;
        // localStorage.setItem('GOS_User', JSON.stringify(res))
        this._current.storeUserDetails(res);
        if(res?.status.isSuccessful) {
          this.loginFormSubmitted = true;
          this.profile = res;
          if(this.profile.customerTypeId == 1) {
            this.router.navigate(['training-provider']);
          } else {
            this.router.navigate(['training-instructor']);
          }
        } else {
          this.isError = true;
          this.err_message = res?.status?.message?.friendlyMessage
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoggingIn = false;
        this.loginFormSubmitted = true;
        this.err_message = error?.error?.message;
      },
    });
  }
}
