import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { UserRoleService } from 'app/pages/user-role/services/user-role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-admin-dialog',
  templateUrl: './add-admin-dialog.component.html',
  styleUrls: ['./add-admin-dialog.component.scss']
})
export class AddAdminDialogComponent implements OnInit {
  public sub: Subscription = new Subscription();
  @ViewChild('close') close!: ElementRef;
  public faqForm!: FormGroup;
  public isLoading: boolean = false;
  public faqFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;
  public createdBy!: number;
  public showPassword!: boolean;
  public userRole: any[] = [];
  public isLoadingPages!: boolean;
  public isLoadingPagesFailed!: boolean;

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _currentservice: CurrentUserService,
    private _helper: HelperService,
    private _auth: AuthService,
    private _userRole: UserRoleService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentservice.getUser();
    this.initFaqForm();
    this.getAllUserRoles()
  }

  public getAllUserRoles() {
    this.isLoadingPages = true,
    this.sub.add(
      this._userRole.getAllUserRoles().subscribe({
        next: (res: any) => {
          // console.log(res);
          this.isLoadingPages = false;
          this.isLoadingPagesFailed = false;
          this.userRole = res;
        },
        error: (err) => {
          this.isLoadingPages = false;
          this.isLoadingPagesFailed = true;
        }
      })
    )
  }



  initFaqForm() {
    this.faqForm = this.fb.group({
      name: ['', Validators.required],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      userRoleId: [this.data.editObject?.userRoleId ?? null, Validators.required],
      physicalAddress: [''],
      phoneNumber: [''],
      companyId: [0],
      password: ['', Validators.required],
    });

  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.faqFormSubmitted = true;
    if(this.data.isEditing) {
      if(this.faqForm.get('userRoleId')!.value) {
        this._helper.startSpinner();
      this.isLoading = true;
      const payload = {
        userId: this.data.editObject.userId,
        userRoleId: this.faqForm.get('userRoleId')!.value
      };
      this._auth.updateUserRole(payload).subscribe({
        next: (res: any) => {
          if(res == true) {
            this._helper.stopSpinner();
            this.isLoading = false;
            // console.log(res)
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.faqFormSubmitted = false;
            this.close.nativeElement.click();
            this._base.openSnackBar(
              'Great...!!!, Your action was successful',
              'success'
            );
          } else {
            this._helper.stopSpinner();
            this._helper.triggerErrorAlert(res.status?.message?.friendlyMessage)
          }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.isLoading = false;
          this.faqFormSubmitted = false;
          // this.error_message = error?.error?.Id[0];
        },
      });
      }
    } else {
      if (this.faqForm.valid) {
        this._helper.startSpinner();
        this.isLoading = true;
        const payload = this.faqForm.value;
        this._auth.register(payload).subscribe({
          next: (res: any) => {
            if(res.status.isSuccessful) {
              this._helper.stopSpinner();
              this.isLoading = false;
              // console.log(res)
              this.event.emit({
                isEditing: this.data?.isEditing,
                editObject: payload,
              });
              this.faqFormSubmitted = false;
              this.close.nativeElement.click();
              this._base.openSnackBar(
                'Great...!!!, Your action was successful',
                'success'
              );
            } else {
              this._helper.stopSpinner();
              this._helper.triggerErrorAlert(res.status?.message?.friendlyMessage)
            }
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            console.log(error);
            this.isLoading = false;
            this.faqFormSubmitted = false;
            // this.error_message = error?.error?.Id[0];
          },
        });
      }
    }
  }
}

