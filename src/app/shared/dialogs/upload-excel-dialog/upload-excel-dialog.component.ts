import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { UtilityService } from '@shared/services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-excel-dialog',
  templateUrl: './upload-excel-dialog.component.html',
  styleUrls: ['./upload-excel-dialog.component.scss']
})
export class UploadExcelDialogComponent implements OnInit {
  //event for added position or updated position
  public sub: Subscription = new Subscription();
  @ViewChild('close') close!: ElementRef;
  public isLoading: boolean = false;
  public UploadForm!: FormGroup;
  public UploadFormSubmitted: boolean = false;
  public error_message: string = '';
  public file!: File;
  public transpose: boolean = false;
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObj?: any; isEditing: boolean }>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    private util: UtilityService,
    public dialog: MatDialog,
    public _helper: HelperService,
    private fb: FormBuilder,
    private _base: BaseComponent
  ) {}

  ngOnInit(): void {}

  initializeForm() {
    this.UploadForm = this.fb.group({
      cycleId: [this.data.editObject.payload.cycleid],
      userId: [this.data.editObject.payload.userId],
      IsTransposed: [false]
    })
  }

  getFile(event: File) {
    this.file = event;
  }

  removeFile() {
    this.file = null as any;
  }

  getTransportAction() {
    this.transpose = !this.transpose;
  }

  public formatBytes(decimals = 2): string {
    if (this.file.size === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(this.file.size) / Math.log(k));
    return (
      parseFloat((this.file.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    );
  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    if (this.file) {
      this.UploadFormSubmitted = true;
      this._helper.startSpinner();
      const payload = this.data.editObject.payload;
      if(this.data.editObject?.transpose) {
        payload.IsTransposed = this.transpose;
      };
      const endpoint = this.data.editObject.endpoint;
        this.util.upload(this.file, endpoint, payload).subscribe({
          next: (res: any) => {
            this._helper.stopSpinner();
            this.UploadFormSubmitted = false;
            this.file = null as any;
            const message = res?.status?.message.friendlyMessage;
            (res.status.isSuccessful) ?
              this._base.openSnackBar(message, 'success') :
              this._base.openSnackBar(message, 'error');
            this.event.emit({
              isEditing: this.data.isEditing,
              editObject: true,
            });
            this.UploadFormSubmitted = false;
            this.close.nativeElement.click();
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            this.UploadFormSubmitted = false;
            this.isLoading = false;
            this.error_message = error?.error?.status.message.friendlyMessage;
            this._base.openSnackBar(this.error_message, 'error');
          },
        });
     }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

