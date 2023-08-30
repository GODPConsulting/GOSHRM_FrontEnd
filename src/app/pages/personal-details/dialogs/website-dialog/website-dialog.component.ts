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
  public createdBy!: number;
  public websites!: FormArray;

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: Website;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: Website; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Website[]>,
    private fb: FormBuilder,
    private _profile: ProfileService,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _currentservice: CurrentUserService,
    private _helper: HelperService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentservice.getUser();
    this.createdBy = CreatedByType.admin
    this.initWebsiteForm();
    if(this.data.editObject.length > 0) {
      this.patchSocialMedia();
      this.remove(0);
    };
  }


  initWebsiteForm() {
    this.websiteForm = this.fb.group({
      websites: this.fb.array([
        this.fb.group({
          websiteId: [0],
          website_Link: ['https://',
            [
              Validators.required,
              Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
            ]
          ],
          website_Name: ['', Validators.required],
          companyId: [this.loggedInUser.companyId],
          userId: ['company'],
          sociaMediaCreatedByType: [this.createdBy]
        })
      ]),
    })
  }

  get newForm(): FormArray {
    return this.websiteForm.get('websites') as FormArray;
  }

  addWebsite() {
    this.newForm.push(this.createTableRow());
  }

  private createTableRow(): FormGroup {
    return this.fb.group({
      websiteId: [0],
      website_Link: ['https://',
        [
          Validators.required,
          Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
        ]
      ],
      website_Name: ['', Validators.required],
      companyId: [this.loggedInUser.companyId],
      userId: ['company'],
      sociaMediaCreatedByType: [this.createdBy]
    });
  }

  remove(index: number): void{
    this.websites.removeAt(index);
  }

  public patchSocialMedia() {
    this.data.editObject.map((item: any) => {
      const tmpDict: any = {};
      tmpDict['websiteId'] = new FormControl(item?.websiteId);
      tmpDict['website_Link'] = new FormControl(item?.website_Link);
      tmpDict['website_Name'] = new FormControl(item?.website_Name);
      tmpDict['companyId'] = new FormControl(this.loggedInUser.companyId);
      tmpDict['userId'] = new FormControl('company');
      tmpDict['SociaMediaCreatedByType'] = new FormControl(this.createdBy);

      this.websites = this.websiteForm.get('websites') as FormArray;
      this.websites.push(new FormGroup(tmpDict));
    });
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
      const payload = this.websiteForm.get('websites')?.value;
      console.log(payload)
      this._profile.updateWebsites(payload).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isLoading = false;
            console.log(res)
            // if (this.data?.isEditing) {
            //   payload.trainingProviderId = payload?.trainingProviderId;
            //   payload.active = true;
            //   payload.deleted = false;
            // } else {
            //   payload.trainingProviderId = res?.response?.trainingProviderId;
            // }
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

export class WebsiteDTO {
  websiteId= 0;
  website_Name= "";
  website_Link = "";
  companyId = 0;
}

