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
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Profile } from '../../models/user-profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-company-info-dialog',
  templateUrl: './edit-company-info-dialog.component.html',
  styleUrls: ['./edit-company-info-dialog.component.scss'],
})
export class EditCompanyInfoDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public updateProfileForm!: FormGroup;
  public isLoading: boolean = false;
  public profileFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: Profile;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: Profile; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Profile>,
    private fb: FormBuilder,
    private _profile: ProfileService,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _currentService: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.initUpdateProfileForm();
  }

  initUpdateProfileForm() {
    this.updateProfileForm = this.fb.group({
      instructor_Name: [this.data?.editObject?.instructor_Name ? this.data?.editObject?.instructor_Name  : '' ],
      trainingInstructorEmail: [this.data?.editObject?.trainingInstructorEmail ? this.data?.editObject?.trainingInstructorEmail  : ''],
      trainingInstructorPhoneNumber: [this.data?.editObject?.trainingInstructorPhoneNumber ? this.data?.editObject?.trainingInstructorPhoneNumber  : ''],
      physical_Address: [this.data?.editObject?.physical_Address ? this.data?.editObject?.physical_Address  : ''],
      bios: [this.data?.editObject?.bios ? this.data?.editObject?.bios  : ''],
      linkedin_Link: [this.data?.editObject?.linkedin_Link ? this.data?.editObject?.linkedin_Link  : ''],
      twitter_Link: [this.data?.editObject?.twitter_Link ? this.data?.editObject?.twitter_Link  : ''],
    })
  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.profileFormSubmitted = true;
    if (this.updateProfileForm.valid) {
      this.isLoading = true;
      const payload = this.updateProfileForm.value;
      payload.trainingProviderId = this.loggedInUser.trainingProviderId;
      payload.instructorId = this.data?.editObject?.instructorId;
      this._profile.updateProfile(payload, this.loggedInUser.trainingProviderId).subscribe({
        next: (res: ResponseModel<Profile>) => {
          this.isLoading = false;
          console.log(res)
          if (this.data?.isEditing) {
            payload.trainingProviderId = payload?.trainingProviderId;
            payload.active = true;
            payload.deleted = false;
          } else {
            payload.id = res;
          }
          // delete payload?.id;
          this.event.emit({
            isEditing: this.data?.isEditing,
            editObject: payload,
          });
          this.profileFormSubmitted = false;
          this.close.nativeElement.click();
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.isLoading = false;
          this.profileFormSubmitted = false;
          // this.error_message = error?.error?.Id[0];
        },
      });
    }
  }
}