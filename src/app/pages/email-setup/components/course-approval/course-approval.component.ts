import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { CourseApprovalService } from '../../services/course-approval.service';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-course-approval',
  templateUrl: './course-approval.component.html',
  styleUrls: ['./course-approval.component.scss']
})
export class CourseApprovalComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public emailConfigForm!: FormGroup;
  public emailConfigFormSubmitted!: boolean;
  public error_message!: string;
  public authenticationMode: any;
  public showPassword: boolean = false;
  @Input() emailConfigDetail!: any
  public loggedInUser!: any;

  constructor(
    private fb: FormBuilder,
    private _helper: HelperService,
    private _approval: CourseApprovalService,
    public dialog: MatDialog,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.initializeForm();
    this.loadSilently();
  }


  public loadSilently(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._approval.getEmailSetup(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.emailConfigDetail = res['emailSetupTypes'];
          this.initializeForm();
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  initializeForm(){
    this.emailConfigForm = this.fb.group({
      sender_Email: [
        this.emailConfigDetail?.sender_Email ?? '',
        [Validators.required, Validators.email]
      ],
      sender_Username: [
        this.emailConfigDetail?.sender_Username ?? '',
        Validators.required
      ],
      sender_Password: [
       this.emailConfigDetail?.sender_Password ?? '',
        Validators.required
      ],
      stmp_Client: [
        this.emailConfigDetail?.stmp_Client ?? '',
      ],
      smtp_Port: [
        this.emailConfigDetail?.smtp_Port ?? '',
      ],
      mail_Caption: [
        this.emailConfigDetail?.mail_Caption ?? '',
      ],
      send_notification: [
        this.emailConfigDetail?.send_notification ?? false,
      ],
      enableSSl: [
        this.emailConfigDetail?.enableSSl ?? false,
      ],
      baseFrontEndURL: [
        this.emailConfigDetail?.baseFrontEndURL ?? '',
      ],
      emailId: [
        this.emailConfigDetail?.emailId ?? 0,
      ],
      companyId: [
        this.emailConfigDetail?.companyId ?? this.loggedInUser.companyId,
      ]
    })
  }


  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    if (this.emailConfigForm.valid) {
      this.emailConfigFormSubmitted = true;
      this._helper.startSpinner();
       const payload = this.emailConfigForm.value;
        this._approval.addEmailSetup(payload).subscribe({
          next: (res: any) => {
            this._helper.stopSpinner();
            const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Email configuration saved successfully!',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.loadSilently();
              } else {
                this.error_message = message;
              }
            this.emailConfigFormSubmitted = false;
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            this.emailConfigFormSubmitted = false;
            this.error_message = error?.error?.status.message.friendlyMessage;
          },
        });
     }
  }

}
