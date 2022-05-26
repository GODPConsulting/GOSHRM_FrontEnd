import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrenciesService } from '@core/services/currencies.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-upload-course-participant-dialog',
  templateUrl: './upload-course-participant-dialog.component.html',
  styleUrls: ['./upload-course-participant-dialog.component.scss']
})
export class UploadCourseParticipantDialogComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public isLoading: boolean =false;
  public uploadParticipantForm!: FormGroup;
  public file!: any;


  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<UploadCourseParticipantDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public dialog: MatDialog,
    private _course: CourseCreationService,
    private _helper: HelperService,
    private fb: FormBuilder,
    private _currency: CurrenciesService
  ) { }

  ngOnInit() {
    this.uploadParticipantForm = this.fb.group({
      uploadInput: [""],
    });
  }

  onSelectedFile(event: any) {
    this._currency.uploadFileValidator(event);
    this.file = event?.target?.files[0];
  }

  submit() {
    this.isLoading = true;
    const body = {
      courseId: this.data?.editObject?.courseId
    }
     this._course.UploadParticipants(body, this. file)
     .then((data) => {
       this._helper.triggerSucessAlert(data.status.message.friendlyMessage);
       this.close.nativeElement.click();
     })
     .catch((err) => {
       this._helper.triggerErrorAlert(err);
       console.log(err)
     })
  }

}


