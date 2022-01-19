import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/base/base/base.component';
import { users } from './../../../models/response.model'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoggingIn: boolean = false;
  public showPassword: boolean = false;
  public err_message: string = '';
  public isError: boolean = false;
  public User= users;
  constructor(
    private _base: BaseComponent,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  public login(): void {
    const payload = this.loginForm.value;
    
    this.User.find(m => {
      this.isLoggingIn = true;
       m.username == payload.email;
      if(m.username == payload.email && m.password == payload.password) {
        if(m.userRole == 'provider') {
          this.isLoggingIn = true;
            setTimeout(() => {
              this.isLoggingIn = false;
              this._base.openSnackBar('Logged in successfully', 'success');
            }, 3000);
            this.router.navigate(['training-provider/profile'])
        } else {
          this.isLoggingIn = false;
            setTimeout(() => {
              this.isLoggingIn = false;
              this._base.openSnackBar('Logged in successfully', 'success');
            }, 3000);
            this.router.navigate(['training-instructor/profile'])
        }
        localStorage.setItem('user', JSON.stringify(m));
      } else {
        setTimeout(() => {
          this.isLoggingIn = false;
          this.isError = true;
          this.err_message = 'wrong credentials';
        }, 3000);
      }
    })
  }
}
