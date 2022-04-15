import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.scss']
})
export class ViewMessageComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public htmlContent: string = '';
  public loggedInUser: any;
  public messageId: any;
  public courseId: any;
  public message: any;
  public allUsers: any[] = [];
  public isForwarding: boolean = false;
  public isFetchingUsers: boolean = false;
  public isFetchingMessage: boolean = false;
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
    private _helper: HelperService,
    private _communication: CommunicationService,
    private _route: ActivatedRoute,
    private _current: CurrentUserService,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.messageId = this._route.snapshot.paramMap.get('messageId');
    this._route.queryParams.subscribe(params => {
      this.courseId = params.courseId;
    });
    console.log(this.messageId, this.courseId)
    this.getMessage();
    this.getAllUsers();
  }

  public getMessage(): void {
    this.isFetchingMessage = true;
    this._helper.startSpinner();
    const payload = {
      messageId: this.messageId,
      courseId: this.courseId
    };
    this.sub.add(
      this._communication.getMessageById(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingMessage = false;
          this.message = res['courseMessageresponse'];
          console.log(this.message);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingMessage = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
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

  public openMessager(){
    let messager = document.getElementById('messager');
    if(messager?.classList.contains('d-none')) {
      messager.classList.remove('d-none');
    } else {
      messager?.classList.add('d-none');
    }
  }

  public openReply(isForwarding: boolean){
    this.isForwarding = isForwarding;
    let messager = document.getElementById('reply-box');
    if(messager?.classList.contains('d-none')) {
      messager.classList.remove('d-none');
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      messager?.classList.add('d-none');
      window.scroll(0, 0)
    }
  }

  public submit() {
    this._helper.startSpinner();
    console.log(this.htmlContent)
    const payload = {
      courseMessageId: +this.messageId,
      courseMessagereplyId: 0,
      courseId: +this.courseId,
      message: this.htmlContent,
      senderEmail: this.loggedInUser.userName,
      companyId: this.loggedInUser.companyId
    };
    console.log(payload)
      this.sub.add(
        this._communication.replyMessage(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            if(res.status.isSuccessful) {
              this._helper.stopSpinner();
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
