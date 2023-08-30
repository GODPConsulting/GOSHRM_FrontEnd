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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { InstructorInformationService } from '../../services/instructor-information.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  //event for added position or updated position
  public sub: Subscription = new Subscription();
  @ViewChild('close') close!: ElementRef;
  public incidentForm!: FormGroup;
  public isLoading: boolean = false;
  public incidentFormSubmitted: boolean = false;
  public error_message: string = '';
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObj?: any; isEditing: boolean }>();
  public empLoading: boolean = false;
  public empLoadingFailed: boolean = false;
  public gradeLoading: boolean = false;
  public gradeLoadingFailed: boolean = false;
  public companies: any []= [];
  public jobGrades: any []= [];
  public loggedInUser!: any;
  public file!: File;
  public documentUrl!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    private fb: FormBuilder,
    private _content: InstructorInformationService,
    public dialog: MatDialog,
    public _helper: HelperService,
    private _current: CurrentUserService,
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.initIncidentForm();
  }

  public initIncidentForm(): void {
    this.incidentForm = this.fb.group({
      pageBannerId: [
        this.data?.isEditing ? this.data?.editObject?.pageBannerId : 0,
        Validators.required,
      ],
      pageBannerName: [
        this.data?.isEditing ? this.data?.editObject?.pageBannerName : '',
        Validators.required,
      ],
      pageBannerTitle: [
        this.data?.isEditing ? this.data?.editObject?.pageBannerTitle : '',
        Validators.required,
      ],
      companyId: [ this.loggedInUser.companyId],
    });
  }



  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.incidentFormSubmitted = true;
    if (this.incidentForm.valid) {
      this.incidentFormSubmitted = true;
      this._helper.startSpinner();
        const payload = this.incidentForm.value;
        this._content.addUpdateBanner(payload).subscribe({
          next: (res: any) => {
            this._helper.stopSpinner();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
              swal.fire("GOSHRM", message, "success");
              this.event.emit({
                isEditing: this.data.isEditing,
                editObject: payload,
              });
              this.close.nativeElement.click();
            } else {
              this.error_message = message;
            }
            this.incidentFormSubmitted = false;
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            this.incidentFormSubmitted = false;
            this.isLoading = false;
            this.error_message = error?.error?.status.message.friendlyMessage;
          },
        });
     }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

