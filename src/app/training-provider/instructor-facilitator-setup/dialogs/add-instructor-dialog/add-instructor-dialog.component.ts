import { HttpErrorResponse } from '@angular/common/http';
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-add-instructor-dialog',
  templateUrl: './add-instructor-dialog.component.html',
  styleUrls: ['./add-instructor-dialog.component.scss']
})

export class AddInstructorDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public addFacilitatorForm!: FormGroup;
  public isLoading: boolean =false;
  public isRegistering: boolean =false;
  public isRegisteringFormSubmitted: boolean =false;
  public isError: boolean =false;
  public error_message: string = '';
  public loggedInUser: any;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<AddInstructorDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    private fb: FormBuilder,
    private _instructor: InstructorService,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._currentService.getUser();
    this.addNewFacilitatorForm();
  }

  public addNewFacilitatorForm() {
    this.addFacilitatorForm = this.fb.group({
      trainingInstructorEmail: [''],
      instructor_Name: [''],
      bios: [''],
      linkedIn_Link: [''],
      twitter_Link: [''],
      instructor_Image: [0],
      password: ['Password@1']
      // addCourseIndex: this.fb.array([
      //   this.fb.group({
      //       course_Name: [''],
      //       difficulty_Level: [''],
      //       duration: [''],
      //       date: [''],
      //   })
      // ])
    })
  }

  // get facilitatorItems() {
  //   return this.addFacilitatorForm.get('addCourseIndex') as FormArray;
  // }

  // public addNewCourse() {
  //   this.facilitatorItems.push(this.fb.group({
  //       course_Name: [''],
  //       difficulty_Level: [''],
  //       duration: [''],
  //       date: [''],
  //   }))
  // }

  // public removeCourse(i: number) {
  //   if(i === 0) {return;}
  //   this.facilitatorItems.removeAt(i);
  // }


  public submit(): void {
    this.isRegistering = true;
    this.isRegisteringFormSubmitted = true;
    const payload = this.addFacilitatorForm.value;
    payload.trainingProviderId = this.loggedInUser.trainingProviderId;
    if(this.addFacilitatorForm.valid) {
      this._instructor.AddNewFacilitator(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.isRegistering = false;
          if(res.status.isSuccessful) {
            this.isRegisteringFormSubmitted = true;
          } else {
            this.isError = true;
            this.error_message = res?.status?.message?.friendlyMessage
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.isRegistering = false;
          this.isRegisteringFormSubmitted = true;
          this.error_message = error?.error?.message
        }
      })
    }  else {
      this.isRegistering = false;
      this.isError = true;
      this.error_message = "Kindly fill the form correctly"
    }
  }

}

