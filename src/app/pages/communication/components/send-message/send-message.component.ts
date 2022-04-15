import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseModel } from 'app/models/response.model';
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
  public allUsers: any[] = [];
  public isFetchingUsers: boolean = false;
  public companyId: number = 0;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarPosition: 'bottom',
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

  constructor(
    private fb: FormBuilder,
    private _communication: CommunicationService,
    private _helper: HelperService,
    private _current: CurrentUserService,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.senderEmail = this.loggedInUser.userName;
    this.initMessageForm();
    this.getAllUsers();
  }

  public getAllUsers(): void {
    this.isFetchingUsers = true;
    this._helper.startSpinner();
    this.sub.add(
      this._auth.getAllUsers().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingUsers = false;
          this.allUsers = res['users'];
          // console.log(res, this.allUsers);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingUsers = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

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
    console.log(this.htmlContent)
    const payload = this.messageForm.value;
    payload.courseId = 1;
    payload.message = this.htmlContent;
    // payload.courseId = +this.courseId;
    let recipients = [];
    let recipient = this.allUsers.filter((m: any) => {
       return payload.recipients.find((user: any) => {
          return user === m.userId
        })
    });
    let user = recipient.map((m: any) => {
          let createdBy
          if (m.userType == 1) {
            createdBy = CreatedByType.provider
          } else if (m.userType == 2) {
            createdBy = CreatedByType.instructor
          } else if (m.userType == 3) {
            createdBy = CreatedByType.participant
          } else {
            createdBy = CreatedByType.admin
          }
          return {
            recipientId: m.userId,
            recipientType: createdBy,
          }
    })
    recipients.push(user);
    payload.recipients = recipients[0];
    console.log(payload)
    if(this.messageForm.valid) {
      this.sub.add(
        this._communication.sendNewMessage(payload).subscribe({
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
