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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { SetupService } from '../../services/setup.service';

@Component({
  selector: 'app-specialization-dialog',
  templateUrl: './specialization-dialog.component.html',
  styleUrls: ['./specialization-dialog.component.scss']
})
export class SpecializationDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public faqForm!: FormGroup;
  public isLoading: boolean = false;
  public faqFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;
  public createdBy!: number;
  public showPassword!: boolean;

  //event for added leave or updated leave
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public _base: BaseComponent,
    private _helper: HelperService,
    private _setup: SetupService
  ) {}

  ngOnInit(): void {
    this.initFaqForm();
  }


  initFaqForm() {
    this.faqForm = this.fb.group({
      specializationId: [this.data.editObject?.specilzationId ?? 0, Validators.required],
      name: [this.data.editObject?.name ?? '', Validators.required],
      description: [this.data.editObject?.description ?? '', Validators.required],
    })
  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public submit(): void {
    this.faqFormSubmitted = true;
    if (this.faqForm.valid) {
      this._helper.startSpinner();
      this.isLoading = true;
      const payload = this.faqForm.value;
      this._setup.addUpdateSpecialization(payload).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isLoading = false;
            // console.log(res)
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.faqFormSubmitted = false;
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
          this.faqFormSubmitted = false;
          // this.error_message = error?.error?.Id[0];
        },
      });
    }
  }
  
}

