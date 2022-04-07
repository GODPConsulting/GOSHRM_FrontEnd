import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
     this._route.queryParams.subscribe(params => {
       const route = params.q;
       if(route == 'provider') {
          this.findUser = route;
        }
    });
    console.log(this.findUser)
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registrationForm = this.fb.group({
        full_Name: ['', Validators.required],
        email_Address: ["", Validators.compose([Validators.required, Validators.email])],
        physical_Address: [''],
        companyId: [2],
        password: ['', Validators.required],
    })
  }

  public register(): void {
    this._helper.startSpinner();
    this.isRegistering = true;
    this.isRegisteringFormSubmitted = true;
    const payload = this.registrationForm.value;
    const operation = this.findUser == 'provider' ? 'registerProvider' : 'registerParticipant';
    if(this.findUser != 'provider') {
      payload.ParticipantName = payload.full_Name;
      payload.EmailAddress = payload.email_Address;
      payload.Password = payload.password;
      payload.PhysicalAddress = 'Nigeria';
      payload.DeliveryType = 'online';
      payload.Status = 'Pending';
      payload.PhoneNumber = '08065126534';
      delete payload.full_Name;
      delete payload.email_Address;
      delete payload.password;
      delete payload.physical_Address;
    }
    console.log(payload);
    if(this.registrationForm.valid) {
      this.auth[operation](payload).subscribe({
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
