import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public isLoading: boolean =false;
  public file!: File;


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
    private _helper: HelperService
  ) { }

  ngOnInit() {
    
  }

  submit() {
    this.isLoading = true;
    // if (!this.locationUploadForm.get("uploadInput").value) {
    //   return swal.fire("Error", "Select a file", "error");
    // }
    const formData = new FormData();
    formData.append(
      "File", this.file
    );
    formData.append(
      "CourseId", this.data?.editObject?.courseId
    );
    this.sub.add(
      this._course.uploadCourseParticipants(formData).subscribe(
        (res: any) => {
          this.isLoading = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            this._helper.triggerSucessAlert(message);
            this.close.nativeElement.click();
          } else {
            this._helper.triggerErrorAlert(message);
          }
        },
        (err) => {
          this.isLoading = false;
          const message = err.status.message.friendlyMessage;
          this._helper.triggerErrorAlert(message);
        }
      )
    )
  }

}



