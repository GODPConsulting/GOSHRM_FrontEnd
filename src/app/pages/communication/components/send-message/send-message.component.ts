import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  @Input() type: string = '';
  @Input() announcementType: number = 0;
  @Input() isPromotional!: boolean;
  public sub: Subscription = new Subscription();
  public current_tab: string = 'all';
  public htmlContent: string = '';
  public messageForm!: FormGroup;
  public announcementForm!: FormGroup;
  public loggedInUser: any;
  public senderEmail: any;
  public courseId: any;
  public recipient: any;
  public allUsers: any[] = [];
  public contactLists: any[] = [];
  public isFetchingUsers: boolean = false;
  public isFetchingContacts: boolean = false;
  public companyId: number = 0;
  public createdBy: number = 0;
  public loggedInId: number = 0;
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
    private _auth: AuthService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.courseId = this._route.snapshot.paramMap.get('id')
    this.loggedInUser = this._current.getUser();
    this.companyId = this.loggedInUser.companyId;
    this.senderEmail = this.loggedInUser.userName;
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
      this.loggedInId = this.loggedInUser.trainingProviderId
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
      this.loggedInId = this.loggedInUser.trainingInstructorId
    }
    this.initMessageForm();
    this.getAllUsers();
    // this.getAllContactList();
  }

  public getAllUsers(): void {
    this.isFetchingUsers = true;
    this._helper.startSpinner();
    const payload = {
      requesterId: this.loggedInId,
      createdByType: this.createdBy
    }
    this.sub.add(
      this._auth.getAllUsers(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingUsers = false;
          this.allUsers = res['users'];
          console.log(res, this.allUsers);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingUsers = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public getAllContactList(): void {
    this.sub.add(
      this._communication.getAllContactList().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingContacts = false;
          this.contactLists = res['contactListResponse'];
          console.log(res, this.contactLists);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingContacts = false;
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

  public initAnnouncementForm() {
    this.messageForm = this.fb.group({
      courseAnnouncementId: [0],
      announcementType: [0],
      subject: [''],
      message: [''],
      courseId: [0],
      modeOfSending: [0],
      contactListId: [0],
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
    console.log(this.htmlContent);
    let data;
    if(this.type == 'message') {
      data = this.messageForm.value;
    } else {
      data = this.announcementForm.value;
    }
    const payload = data;
    payload.message = this.htmlContent;
    payload.courseId = +this.courseId;
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
            recipientEmail: m
          }
    })
    recipients.push(user);
    payload.recipients = recipients[0];
    const operation = this.type === 'message' ? 'sendNewMessage' : 'sendNewAnnouncement';
    console.log(payload)
      this.sub.add(
        this._communication[operation](payload).subscribe({
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
