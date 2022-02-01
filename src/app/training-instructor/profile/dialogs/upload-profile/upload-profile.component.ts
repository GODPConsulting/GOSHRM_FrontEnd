import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-profile',
  templateUrl: './upload-profile.component.html',
  styleUrls: ['./upload-profile.component.scss'],
})
export class UploadProfileComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  imageChangedEvent: any = null;
  croppedImage: any = "";
  croppedImageFile: any = "";
  imageUploaded = false;
  isLoading = false;
  imageCrop: boolean = false;
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<UploadProfileComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
  ) { }

  ngOnInit() {

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
    return new File([u8arr], filename, { type: mime });
  }

  continue() {
    this.imageCrop = !this.imageCrop
  }


  public submit(): void {
    this.isLoading = true;
    this.event.emit({
      isEditing: this.data?.isEditing,
      editObject: this.croppedImage,
    });
  }
}
