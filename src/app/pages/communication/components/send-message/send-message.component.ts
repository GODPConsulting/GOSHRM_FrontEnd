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
  public recipients: any[] = [];
  public isFetchingUsers: boolean = false;
  public isFetchingContacts: boolean = false;
  public companyId: number = 0;
  public createdBy: number = 0;
  public loggedInId: number = 0;
  public newRecipient = (recipient: any) => ({name:  recipient, type: 0, userType: 0});
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
    console.log(this.type)
    if(this.type == 'message'){
      this.initMessageForm();
    } else {
      this.initAnnouncementForm();
    }
    this.getAllUsers();
    console.log(this.announcementType)
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
      courseId: [+this.courseId],
      senderEmail: [this.senderEmail],
      recipients: [],
      companyId: [this.companyId]
    })
  }

  public initAnnouncementForm() {
    this.announcementForm = this.fb.group({
      courseAnnouncementId: [0],
      announcementType: [2],
      subject: [''],
      message: [''],
      courseId: [+this.courseId],
      modeOfSending: [0],
      contactListIds: [],
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
    let data;
    if(this.type == 'message') {
      data = this.messageForm.value;
    } else {
      data = this.announcementForm.value;
    }
    console.log(this.recipient)
    const payload = data;
    payload.message = this.htmlContent;
    console.log(payload)
    let recipients = [];
    let contacts = [];
    let emails = [];
    let recipient = this.allUsers.filter((m: any) => {
       return this.recipient.find((user: any) => {
          return user === m
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
          if(m.type == 1) {
            return {
              recipientId: m.userId,
              recipientType: createdBy,
              recipientEmail: m.name
            }
          } else {
            return null
          }
         
    });
    let contact = recipient.map((c: any) => {
      if(c.type == 2) {
        return c.contactListId
      }
    })
    let email = this.recipient.map((c: any) => {
      if(c.type == 0) {
        return {
          recipientEmail: c.name
        }
      } else {
        return null
      }
      
    });
    recipients.push(user);
    contacts.push(contact)
    emails.push(email)
    console.log(emails, emails[0]);
    payload.recipients = recipients[0];
    for (var i of emails[0]) {
      payload.recipients.push(i);
    }
    payload.contactListIds = contacts[0];
    const results = payload.recipients.filter((element: any) => {
      return element !== null;
    });
    const contactResults = payload.contactListIds.filter((element: any) => {
      return element !== undefined;
    });
    payload.recipients = results;
    payload.contactListIds = contactResults;
    const operation = this.type === 'message' ? 'sendNewMessage' : 'sendNewAnnouncement';
    console.log(payload)
      this.sub.add(
        this._communication[operation](payload).subscribe({
          next: (res: any) => {
            console.log(res);
            if(res.status.isSuccessful) {
              this._helper.stopSpinner();
              this.openMessager();
              this._helper.triggerSucessAlert('Course outline created successfully!!!');
              this.recipient = [];
              this.messageForm.reset();
              this.announcementForm.reset();
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
