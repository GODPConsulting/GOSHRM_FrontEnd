import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { MessageType } from '../../models/communication.model';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public current_tab: string = 'all';
  public loggedInUser: any;
  public courseId: any;
  public messages: any[] = [];
  public isFetchingMessages: any;
  public userType: number = 2;
  public messageType = MessageType;
  public tabType: number = 2;
  public createdBy = CreatedByType;

  constructor(
    private router: Router,
    private _current: CurrentUserService,
    private _communication: CommunicationService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this._route.queryParams.subscribe(params => {
      this.current_tab = params.q;
    });
    this.getAllMessages(MessageType.Inbox, this.userType);
  }

  public getAllMessages(
    messageType: number,
    userType?: number
  ): void {
    this.tabType = messageType;
    this.isFetchingMessages = true;
    this._helper.startSpinner();
    const payload = {
      userType: userType,
      messageType: messageType,
      senderEmail: this.loggedInUser.userName
    };
    this.sub.add(
      this._communication.getAllMessages(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingMessages = false;
          this.messages = res['courseMessageresponse'];
          console.log(res, this.messages);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingMessages = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public getAll(): void {
    this.current_tab = 'all';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'all' } });
    this.getAllMessages(MessageType.Inbox, this.tabType)
  }

  public getParticipant(): void {
    this.current_tab = 'participants';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'participants' } });
    this.getAllMessages(MessageType.Inbox, this.createdBy.participant)
  }

  public getFacilitator(): void {
    this.current_tab = 'facilitator';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'facilitator' } });
    this.getAllMessages(MessageType.Inbox, this.createdBy.instructor)
  }

  public getAdmin(): void {
    this.current_tab = 'admin';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'admin' } });
    this.getAllMessages(MessageType.Inbox, this.createdBy.admin)
  }

  public openMessager(){
    let messager = document.getElementById('messager');
    if(messager?.classList.contains('d-none')) {
      messager.classList.remove('d-none');
    } else {
      messager?.classList.add('d-none');
    }
  }

  public goToMesage(message: any) {
    this.router.navigate([`/communication/view-message/${message?.courseMessageId}`], {
      queryParams: {courseId: message.courseId, page: 'message'},
    });
  }

}
