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
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { FaqHelpService } from '../../services/faq-help.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-faq-dialog',
  templateUrl: './faq-dialog.component.html',
  styleUrls: ['./faq-dialog.component.scss']
})
export class FaqDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public faqForm!: FormGroup;
  public isLoading: boolean = false;
  public faqFormSubmitted: boolean = false;
  public error_message: string = '';
  public loggedInUser!: any;
  public createdBy!: number;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '45rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

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
    private _currentservice: CurrentUserService,
    private _helper: HelperService,
    private _faq: FaqHelpService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentservice.getUser();
    this.initFaqForm();
  }


  initFaqForm() {
    this.faqForm = this.fb.group({
      policyId: [this.data.editObject?.policyId ?? 0],
      policy_Content: [this.data.editObject?.policy_Content ?? '', Validators.required],
      companyId: [this.loggedInUser.companyId, Validators.required],
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
      const payload = {
        policySetupTypes: [this.faqForm.value]
      };
      // console.log(payload)
      this._faq.addUpdateFAQ(payload).subscribe({
        next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this.isLoading = false;
            console.log(res)
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

