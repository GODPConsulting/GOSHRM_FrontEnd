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
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { SocialMedia } from '../../models/user-profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-social-media-dialog',
  templateUrl: './social-media-dialog.component.html',
  styleUrls: ['./social-media-dialog.component.scss']
})
export class SocialMediaDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public socialMediaForm!: FormGroup;
  public isLoading: boolean = false;
  public profileFormSubmitted: boolean = false;
  public error_message: string = '';

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: SocialMedia;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: SocialMedia; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<SocialMedia>,
    private fb: FormBuilder,
    private _profile: ProfileService,
    public dialog: MatDialog,
    public _base: BaseComponent
  ) {}

  ngOnInit(): void {
    this.initSocialMediaForm();
  }

  
  initSocialMediaForm() {
    this.socialMediaForm = this.fb.group({
      linkedInType: [
        this.data?.editObject?.linkedInType ? this.data?.editObject?.linkedInType  : 'https://',
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
       ],
      facebookType: [
        this.data?.editObject?.facebookType ? this.data?.editObject?.facebookType  : 'https://',
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
      ],
      twitterType: [
        this.data?.editObject?.twitterType ? this.data?.editObject?.twitterType  : 'https://' ,
        [Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
      ],
      youtubeType: [
        this.data?.editObject?.youtubeType ? this.data?.editObject?.youtubeType  : 'https://',
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
    this.profileFormSubmitted = true;
    if (this.socialMediaForm.valid) {
      this.isLoading = true;
      const payload = this.socialMediaForm.value;
      payload.trainingProviderId = 3;
      payload.socialMediaId = 2;
      this._profile.updateSocialmedia(payload, payload.trainingProviderId).subscribe({
        next: (res: ResponseModel<SocialMedia>) => {
          this.isLoading = false;
          console.log(res)
          if (this.data?.isEditing) {
            payload.id = payload?.id;
            payload.active = true;
            payload.deleted = false;
          } else {
            payload.id = res?.response?.trainingProviderId;
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