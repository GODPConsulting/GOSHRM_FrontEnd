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
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { ResponseModel } from 'app/models/response.model';
import { Website } from '../../models/user-profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-website-dialog',
  templateUrl: './website-dialog.component.html',
  styleUrls: ['./website-dialog.component.scss']
})
export class WebsiteDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public websiteForm!: FormGroup;
  public isLoading: boolean = false;
  public websiteFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: Website;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: Website; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Website>,
    private fb: FormBuilder,
    private _profile: ProfileService,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _currentservice: CurrentUserService,
    private _helper: HelperService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentservice.getUser();
    this.initWebsiteForm();
  }

  
  initWebsiteForm() {
    this.websiteForm = this.fb.group({
      website_Name_First: [this.data?.editObject?.website_Name_First ? this.data?.editObject?.website_Name_First  : '' ],
      website_Link_First: [
        this.data?.editObject?.website_Link_First ? this.data?.editObject?.website_Link_First  : 'https://',
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
      ],
      website_Name_Second: [this.data?.editObject?.website_Name_Second ? this.data?.editObject?.website_Name_Second  : '' ],
      website_Link_Second: [
        this.data?.editObject?.website_Link_Second ? this.data?.editObject?.website_Link_Second  : 'https://',
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
      ],
      website_Name_Third: [this.data?.editObject?.website_Name_Third ? this.data?.editObject?.website_Name_Third  : '' ],
      website_Link_Third: [
        this.data?.editObject?.website_Link_Third ? this.data?.editObject?.website_Link_Third  : 'https://',
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
      ],
    })
  }


  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.websiteFormSubmitted = true;
    if (this.websiteForm.valid) {
      this._helper.startSpinner();
      this.isLoading = true;
      const payload = this.websiteForm.value;
      payload.trainingProviderId = this.loggedInUser?.trainingProviderId;
      console.log(payload)
      this._profile.updateWebsites(payload, this.loggedInUser?.trainingProviderId).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isLoading = false;
            console.log(res)
            if (this.data?.isEditing) {
              payload.trainingProviderId = payload?.trainingProviderId;
              payload.active = true;
              payload.deleted = false;
            } else {
              payload.trainingProviderId = res?.response?.trainingProviderId;
            }
            // delete payload?.id;
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.websiteFormSubmitted = false;
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
          this.websiteFormSubmitted = false;
          // this.error_message = error?.error?.Id[0];
        },
      });
    }
  }
}

