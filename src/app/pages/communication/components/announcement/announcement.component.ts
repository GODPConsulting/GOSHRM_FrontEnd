import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { ContactListDialogComponent } from '../../dialogs/contact-list-dialog/contact-list-dialog.component';
import { AnnouncementType, MessageType } from '../../models/communication.model';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public current_tab: string = 'contact';
  public current_subTab: string = 'educational';
  public loggedInUser: any;
  public courseId: any;
  public announcements: any[] = [];
  public isFetchingMessages: any;
  public userType: number = 2;
  public messageType = MessageType;
  public tabType: number = 2;
  public createdBy = CreatedByType;
  public announcementType: number = 2;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _current: CurrentUserService,
    private _communication: CommunicationService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this._route.queryParams.subscribe(params => {
      this.current_subTab = params.q;
    });
    console.log(this.current_tab)
    this.getAllMessages(MessageType.Inbox, AnnouncementType.Educational, this.current_tab, this.userType);
  }

  public getAllMessages(
    messageType: number,
    announcementType: number,
    tabType: string,
    userType?: number
  ): void {
    this.current_tab = tabType;
    this.isFetchingMessages = true;
    this._helper.startSpinner();
    const payload = {
      userType: userType,
      announcementType: announcementType,
      messageType: messageType,
      senderEmail: this.loggedInUser.userName
    };
    this.sub.add(
      this._communication.getAllAnnoucement(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingMessages = false;
          this.announcements = res['courseAnnouncementresponse'];
          console.log(res, this.announcements);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingMessages = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public getEducational(): void {
    this.current_subTab = 'educational';
    this.router.navigate(['/communication/announcement'], { queryParams: { q: 'educational' } });
    this.getAllMessages(MessageType.Sent, AnnouncementType.Educational, this.current_tab)
    this.announcementType = AnnouncementType.Educational
  }

  public getPromotional(): void {
    this.current_subTab = 'promotion';
    this.router.navigate(['/communication/announcement'], { queryParams: { q: 'promotional' } });
    this.getAllMessages(MessageType.Sent, AnnouncementType.Promotional, this.current_tab)
    this.announcementType = AnnouncementType.Promotional
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(ContactListDialogComponent, {
      data: object,
    });
    console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
         
        } else {

        }
      }
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

  public goToMesage(message: any) {
    this.router.navigate([`/communication/view-message/${message?.courseMessageId}`], {
      queryParams: {courseId: message.courseId},
    });
  }

}

