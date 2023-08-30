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
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { ResponseModel } from 'app/models/response.model';
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
  public loggedInUser!: any;
  public createdBy!: number;
  public socialMedias!: FormArray;
  public selectedTypes: number[] = [];

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: SocialMedia;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: SocialMedia; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<SocialMedia[]>,
    private fb: FormBuilder,
    private _profile: ProfileService,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _currentService: CurrentUserService,
    private _healper: HelperService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.createdBy = CreatedByType.admin
    this.initSocialMediaForm();
    if(this.data.editObject.length > 0) {
      this.patchSocialMedia();
      this.remove(0);
      this.selectedTypes = this.data.editObject.map(s => {
        return s.socialMediaType;
      });
      // console.log(this.selectedTypes, this.selectedTypes.includes(1))
    };
  }


  initSocialMediaForm() {
    this.socialMediaForm = this.fb.group({
      socialMedia: this.fb.array([
        this.fb.group({
          socialMediaId: [0],
          socialMediaUrl: ['https://',
            [
              Validators.required,
              Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
            ]
          ],
          socialMediaType: [0, Validators.required],
          companyId: [this.loggedInUser.companyId],
          userId: ['company'],
          SociaMediaCreatedByType: [this.createdBy]
        })
      ]),
    });
  }

  get newForm(): FormArray {
    return this.socialMediaForm.get('socialMedia') as FormArray;
  }

  addSocialMedia() {
    this.newForm.push(this.createTableRow());
  }

   private createTableRow(): FormGroup {
    return this.fb.group({
        socialMediaId: [0],
          socialMediaUrl: ['https://',
          [
            Validators.required,
            Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
          ]
        ],
        socialMediaType: [0, Validators.required],
        companyId: [this.loggedInUser.companyId],
        userId: ['company'],
        SociaMediaCreatedByType: [this.createdBy]
    });
  }

  remove(index: number): void{
    this.socialMedias.removeAt(index);
  }

  public patchSocialMedia() {
    this.data.editObject.map((item: any) => {
      const tmpDict: any = {};
      tmpDict['socialMediaId'] = new FormControl(item?.socialMediaId);
      tmpDict['socialMediaUrl'] = new FormControl(item?.socialMediaUrl);
      tmpDict['socialMediaType'] = new FormControl(item?.socialMediaType);
      tmpDict['companyId'] = new FormControl(this.loggedInUser.companyId);
      tmpDict['userId'] = new FormControl('company');
      tmpDict['SociaMediaCreatedByType'] = new FormControl(this.createdBy);

      this.socialMedias = this.socialMediaForm.get('socialMedia') as FormArray;
      this.socialMedias.push(new FormGroup(tmpDict));
    });
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
      this._healper.startSpinner();
      this.isLoading = true;
      const payload = this.socialMediaForm.get('socialMedia')?.value;
      payload.map((m: any) => {
        m.socialMediaType = +m.socialMediaType
      })
      console.log(payload)
      this._profile.updateSocialmedia(payload).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._healper.stopSpinner();
            this.isLoading = false;
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
          } else {
            this._healper.stopSpinner();
            this._healper.triggerErrorAlert(res.status?.message?.friendlyMessage)
          }
        },
        error: (error: HttpErrorResponse) => {
          this._healper.stopSpinner();
          console.log(error);
          this.isLoading = false;
          this.profileFormSubmitted = false;
          // this.error_message = error?.error?.Id[0];
        },
      });
    }
  }
}


export class socialMedia {
	socialMediaId = 0;
	socialMediaType = 0;
	socialMediaUrl = 'https://';
	companyId = 0;
}
