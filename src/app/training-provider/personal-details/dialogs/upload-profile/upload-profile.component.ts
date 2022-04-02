import { HttpErrorResponse } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-upload-profile',
  templateUrl: './upload-profile.component.html',
  styleUrls: ['./upload-profile.component.scss'],
})
export class UploadProfileComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public imageChangedEvent: any = null;
  public croppedImage: any = "";
  public croppedImageFile: any = "";
  public imageUploaded = false;
  public isLoading = false;
  public imageCrop: boolean = false;
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();
  public createdBy = CreatedByType;
  public loggedInUser: any;

  constructor(
    public dialogRef: MatDialogRef<UploadProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    private _helper: HelperService,
    private _profile: ProfileService,
    private _base: BaseComponent,
    private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageCrop = false
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedImageFile = this.dataURLtoFile(
      this.croppedImage,
      "profileImage.png"
    );
    // console.log(this.croppedImage)
  }

  imageLoaded() {
    this.imageUploaded = !this.imageUploaded;
  }

  loadImageFailed() {
    // this.triggerErrorAlert();
  }

  changePicture() {
    this.imageChangedEvent = null;
    this.croppedImage = "";
    this.croppedImageFile = "";
    this.imageUploaded = !this.imageUploaded;
  }

  dataURLtoFile(dataurl: any, filename: any) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log(arr)
    return new File([u8arr], filename, { type: mime });
  }

  continue() {
    this.imageCrop = !this.imageCrop
  }

  public submit(): void {
    this.isLoading = true;
      this._helper.startSpinner();
      const imageUrl = this.croppedImage.split(",");
      const payload = {
        companyId: this.loggedInUser.companyId,
        cratedByType: this.createdBy.provider,
        updatedBy: this.loggedInUser.userId,
        detailId: this.loggedInUser.trainingProviderId,
        photoUrl: imageUrl[1]
      }
      this._profile.updateProfileImg(payload).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isLoading = false;
            console.log(res)
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: this.croppedImage,
            });
            this.isLoading = false;
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
          // this.error_message = error?.error?.Id[0];
        },
      });
  }
}
