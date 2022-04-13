import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public current_tab: string = 'all';
  public htmlContent: string = '';
  public messageForm!: FormGroup;
  public loggedInUser: any;
  public senderEmail: any;
  public courseId: any;
  public recipient: any;
  public recipients = (recipient: any) => ({ name: recipient });
  public companyId: number = 0;
  public config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '30rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File): Observable<HttpEvent<any>> => { return File },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'bottom',
    toolbarHiddenButtons: [
        [
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'indent',
          'outdent',
          'insertUnorderedList',
          'insertOrderedList',
          'heading',
          'fontName'
        ],
        [
          'fontSize',
          'textColor',
          'backgroundColor',
          'customClasses',
          'link',
          'unlink',
          'insertVideo',
          'insertHorizontalRule',
          'removeFormat',
          'toggleEditorMode'
        ]
    ]
  };

  constructor(
    private fb: FormBuilder,
    private _communication: CommunicationService,
    private _helper: HelperService,
    private _current: CurrentUserService
  ) { }

  public initMessageForm() {
    this.messageForm = this.fb.group({
      courseMessageId: [0],
      subject: [''],
      message: [''],
      courseId: [0],
      senderEmail: [this.senderEmail],
      recipients: [],
      companyId: [this.companyId]
    })
  }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.senderEmail = this.loggedInUser.userName;
    this.initMessageForm();
  }

  public checkForKeyEnter(event: any): void {
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8) {
    }
  }

  public openMessager(){
    let messager = document.getElementById('messager');
    if(messager?.classList.contains('d-none')) {
      messager.classList.remove('d-none');
    } else {
      messager?.classList.add('d-none');
    }
  }

  public submit() {
    this._helper.startSpinner();
    const payload = this.messageForm.value;
    payload.courseId = 1;
    // payload.courseId = +this.courseId;
    let recipients = [];
    let recipient = payload.recipients.map((m: any) => {
      return {
        recipientId: m,
        recipientType: 1,
      }
    })
    recipients.push(recipient);
    payload.recipients = recipients[0];
    console.log(payload)
    if(this.messageForm.valid) {
      console.log(payload);
      this.sub.add(
        this._communication.AddQuestionAndAnswer(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            if(res.status.isSuccessful) {
              this._helper.stopSpinner();
              this.openMessager();
              this._helper.triggerSucessAlert('Course outline created successfully!!!')
            } else {
              this._helper.stopSpinner();
              this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
            }
          },
          error: (error: any) => {
            this._helper.stopSpinner();
            console.log(error);
          },
        })
      );
    }
  }

}
