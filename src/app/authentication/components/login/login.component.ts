import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoggingIn: boolean = false;
  public showPassword: boolean = false;
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
    this.isLoggingIn = true;
    setTimeout(() => {
      this.isLoggingIn = false;
      this._base.openSnackBar('Logged in successfully', 'success');
    }, 3000);
    this.router.navigate(['candidates/dashboard'])
  }
}
