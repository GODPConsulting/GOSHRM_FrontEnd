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
import { BaseComponent } from '@core/base/base/base.component';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { UserRoleService } from '../../services/user-role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-role-dialog',
  templateUrl: './user-role-dialog.component.html',
  styleUrls: ['./user-role-dialog.component.scss']
})
export class UserRoleDialogComponent implements OnInit {
  public sub: Subscription = new Subscription();
  @ViewChild('close') close!: ElementRef;
  public faqForm!: FormGroup;
  public isLoading: boolean = false;
  public faqFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;
  public createdBy!: number;
  public showPassword!: boolean;
  public pages: any[] = [];
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
    private _helper: HelperService,
    private _userRole: UserRoleService
  ) {}

  ngOnInit(): void {
    this.initFaqForm();
    this.getAllPages();
  }

  public getAllPages() {
    this.isLoadingPages = true,
    this.sub.add(
      this._userRole.getAllPages().subscribe({
        next: (res: any) => {
          console.log(res);
          this.isLoadingPages = false;
          this.isLoadingPagesFailed = false;
          this.pages = res;
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
      userRoleId: [this.data.editObject?.userRoleId ?? 0, Validators.required],
      name: [this.data.editObject?.name ?? '', Validators.required],
      description: [this.data.editObject?.description ?? '', Validators.required],
      pages: [this.data.editObject?.pages ?? [], Validators.required],
    })
  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.faqFormSubmitted = true;
    if (this.faqForm.valid) {
      this._helper.startSpinner();
      this.isLoading = true;
      const payload = this.faqForm.value;
      this._userRole.addUpdateUserRole(payload).subscribe({
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

