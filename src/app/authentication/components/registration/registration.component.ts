import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/base/base/base.component';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!: FormGroup;
  public isLoggingIn: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  constructor(
    private _base: BaseComponent, 
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registrationForm = this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        phoneNumber1: ['', Validators.required],
        phoneNumber2: [''],
        email: ['', Validators.required],
        altEmail: [''],
        organizationName: [''],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
    })
  }

  public register(): void {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.isLoggingIn = false;
      this._base.openSnackBar('Registration successfully', 'success');
      this.router.navigate(['/authentication/confirmation'])
    }, 3000);
  }

}
