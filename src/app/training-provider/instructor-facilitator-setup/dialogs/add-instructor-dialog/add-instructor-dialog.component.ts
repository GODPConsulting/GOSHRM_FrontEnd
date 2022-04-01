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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
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
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    private fb: FormBuilder,
    private _instructor: InstructorService,
    private _currentService: CurrentUserService,
    private _helper: HelperService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._currentService.getUser();
    this.addNewFacilitatorForm();
  }

  public addNewFacilitatorForm() {
    this.addFacilitatorForm = this.fb.group({
      trainingInstructorEmail: ['', Validators.required],
      instructor_Name: [''],
      bios: [''],
      linkedIn_Link: [''],
      twitter_Link: [''],
      addCover_Image: [''],
      password: ['Password@1'],
      physical_Address: [''],
      companyId: [this.loggedInUser.companyId]
    })
  }

  public addDocument(event: any): void {
    // let image = event;
    // console.log(image);
    
  }


  public submit(): void {
    this.isRegistering = true;
    this.isRegisteringFormSubmitted = true;
    const payload = this.addFacilitatorForm.value;
    payload.trainingProviderId = this.loggedInUser.trainingProviderId;
    payload.addCover_Image = 0;
    if(this.addFacilitatorForm.valid) {
      this._helper.startSpinner();
      this._instructor.AddNewFacilitator(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.isRegistering = false;
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isRegisteringFormSubmitted = true;
            this.event.emit({
              isEditing: this.data.isEditing,
              editObject: payload
            })
            this.close.nativeElement.click();
            this._helper.triggerSucessAlert('Instructor added successfully');
          } else {
            this._helper.stopSpinner();
            this.isError = true;
            this.error_message = res?.status?.message?.friendlyMessage
          }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
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

