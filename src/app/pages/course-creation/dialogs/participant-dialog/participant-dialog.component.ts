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
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';
import { AddParticipantComponent } from '../add-participant/add-participant.component';
import { UploadCourseParticipantDialogComponent } from '../upload-course-participant-dialog/upload-course-participant-dialog.component';

@Component({
  selector: 'app-participant-dialog',
  templateUrl: './participant-dialog.component.html',
  styleUrls: ['./participant-dialog.component.scss']
})

export class ParticipantDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public courseOutlineForm!: FormGroup;
  public isLoading: boolean =false;
  public courseParticipants: any[] = [];
  public isFetchingParticipants: boolean = false;
  public selectedParticipants: any[] = [];
  public viewHeight: any = '500px';


  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<ParticipantDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    public dialog: MatDialog,
    private _course: CourseCreationService,
    private _helper: HelperService
  ) { }

  ngOnInit() {
    this.getParticipants();
  }

  public getParticipants(): void {
    this.isFetchingParticipants = true;
    this._helper.startSpinner();
    const payload = {
      courseId: this.data.editObject.courseId,
      searchParams: ''
    }
    this.sub.add(
      this._course.getcourseParticipant(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingParticipants = false;
          this.courseParticipants = res['course_Participant_Response'];
          console.log(res, this.courseParticipants);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingParticipants = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    this.close.nativeElement.click();
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(AddParticipantComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          
      }
    );
  }

  public openUploadDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    this.close.nativeElement.click();
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(UploadCourseParticipantDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          
      }
    );
  }

  public submit(): void {
    this.isLoading = true;
  }

}


