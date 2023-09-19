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
import { Subscription } from 'rxjs';
import { TestimonyService } from '../../services/testimony.service';

@Component({
  selector: 'app-add-testimony-dialog',
  templateUrl: './add-testimony-dialog.component.html',
  styleUrls: ['./add-testimony-dialog.component.scss']
})
export class AddTestimonyDialogComponent implements OnInit {
  public sub: Subscription = new Subscription();
  @ViewChild('close') close!: ElementRef;
  public faqForm!: FormGroup;
  public isLoading: boolean = false;
  public faqFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;
  public createdBy!: number;
  public showPassword!: boolean;
  public pages: any[] = [];
  public isLoadingPages!: boolean;
  public isLoadingPagesFailed!: boolean;
  public documentUrl: any;
  public file!: File;

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
    private _testimony: TestimonyService,
  ) {}

  ngOnInit(): void {
    this.initFaqForm();
  }


  initFaqForm() {
    this.faqForm = this.fb.group({
      testimonyId: [this.data.editObject?.testimonyId ?? 0, Validators.required],
      name: [this.data.editObject?.name ?? '', Validators.required],
      title: [this.data.editObject?.title ?? ''],
      testimonyText: [this.data.editObject?.testimonyText ?? '', Validators.required],
      makeVisible: [this.data.editObject?.makeVisible ?? false, Validators.required],
      photoUrl: [ this.data.editObject?.photoUrl ?? ''],
      companyId: [2, Validators.required],
    })
  }

  public checkForKeyEnter(event: KeyboardEvent): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
      this.submit();
    }
  }

  public onFileDropped(event: any) {
    console.log(event)
    let me = this;
    this.file = event[0];
    let reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () =>{
        me.documentUrl = reader.result;
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
  }

  public removeFile(): void {
    this.file = null as any;
  }

  public submit(): void {
    this.faqFormSubmitted = true;
    const payload = this.faqForm.value;
    // if(this.file) {
    //   const imgUrl = this.documentUrl.split(",");
    //   payload.photoUrl = imgUrl[1];
    // }
    if (this.faqForm.valid) {
      this._helper.startSpinner();
      this.isLoading = true;
      this._testimony.addUpdateTestimony(payload).subscribe({
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

