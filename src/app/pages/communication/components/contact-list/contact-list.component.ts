import { HttpErrorResponse } from '@angular/common/http';
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
import { UpdateContactDeatilDialogComponent } from '../../dialogs/update-contact-deatil-dialog/update-contact-deatil-dialog.component';
import { AnnouncementType, MessageType } from '../../models/communication.model';
import { CommunicationService } from '../../services/communication.service';
import { SwalConfig } from '../../../../_config/sweetalert';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  public sub: Subscription = new Subscription();
  // public dtOptions: DataTables.Settings = {};
  public subContactTitle: string = '';
  public contactListId!: number
  public current_tab: string = 'contact';
  public current_subTab: string = 'educational';
  public loggedInUser: any;
  public courseId: any;
  public contactLists: any[] = [];
  public contactDetail: any[] = [];
  public selectedContacts: any[] = [];
  public isFetchingMessages: any;
  public userType: number = 2;
  public messageType = MessageType;
  public tabType: number = 2;
  public createdBy = CreatedByType;
  public announcementType: number = 1;
  public isTag: boolean = true;
  public isPromotional: boolean = true;
  public isCheck: boolean = false;

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
      // this.current_subTab = params.q;
    });
    this.getAllContactList(this.announcementType);
  }

  public getAllContactList(type: any): void {
    this._helper.startSpinner();
    const payload = {
      contactType: type,
      providerId: this.loggedInUser.trainingProviderId
    }
    this.sub.add(
      this._communication.getAllContactList(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingMessages = false;
          this.contactLists = res['contactListResponse'];
          console.log(res, this.contactLists);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingMessages = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public getContactListById(tag: any): void {
    this.isTag = false;
    this.subContactTitle = tag?.tagName;
    this.contactListId = tag?.contactListId
    this.sub.add(
      this._communication.getContactById(tag?.contactListId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingMessages = false;
          this.contactDetail = res['contactListDetailResponse'];
          console.log(res, this.contactDetail);
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
    this.router.navigate(['/communication/contact-list'], { queryParams: { q: 'educational' } });
    this.getAllContactList(AnnouncementType.Educational);
    this.isPromotional = false;
    this.isTag = true;
  }

  public getPromotional(): void {
    this.current_subTab = 'promotion';
    this.router.navigate(['/communication/contact-list'], { queryParams: { q: 'promotional' } });
    this.getAllContactList(AnnouncementType.Promotional);
    this.isPromotional = true;
    this.isTag = true;
  }

  public checkUncheckAll() {
    for (var i = 0 ; i < this.contactLists.length; i++) {
      this.contactLists[i].isSelected = this.isCheck;
    }
    this.getCheckedItemList();
  }

  public isAllSelected() {
    this.isCheck = this.contactLists.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
  
  public getCheckedItemList(){
    this.selectedContacts = [];
    for (let i = 0; i < this.contactLists.length; i++) {
      if(this.contactLists[i].isSelected)
      this.selectedContacts.push(this.contactLists[i]);
    }
    console.log(this.selectedContacts);
  }

  public selectDeselectCourses(contact: any) {
    this.selectedContacts.includes(contact)
      ? (this.selectedContacts = this.selectedContacts.filter((c: any) => c!== contact))
      : this.selectedContacts.push(contact);
    console.log(this.selectedContacts)
  }


  public deleteContacts(SelectedContacts?: any): void {
    SwalConfig.fire({
      html:`<p class="alert alert-danger"> 
                <span class="pe-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2908 3.8602L1.82075 18.0002C1.64612 18.3026 1.55372 18.6455 1.55274 18.9947C1.55176 19.3439 1.64224 19.6873 1.81518 19.9907C1.98812 20.2941 2.23748 20.547 2.53846 20.7241C2.83944 20.9012 3.18155 20.9964 3.53075 21.0002H20.4708C20.82 20.9964 21.1621 20.9012 21.463 20.7241C21.764 20.547 22.0134 20.2941 22.1863 19.9907C22.3593 19.6873 22.4497 19.3439 22.4488 18.9947C22.4478 18.6455 22.3554 18.3026 22.1808 18.0002L13.7108 3.8602C13.5325 3.56631 13.2815 3.32332 12.9819 3.15469C12.6824 2.98605 12.3445 2.89746 12.0008 2.89746C11.657 2.89746 11.3191 2.98605 11.0196 3.15469C10.72 3.32332 10.469 3.56631 10.2908 3.8602V3.8602Z" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 9V13" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16V16.5" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>                                              
                </span> 
                <span>Warning: You are about to delete a product from your draft!</span> 
            </p>`,
    }).then((result: any) => {
        if (result.value) {
          let contactListIds = [];
          if(this.isTag) {
            contactListIds = SelectedContacts.map((c: any) => c.contactListId)
          } else {
            contactListIds = SelectedContacts.map((c: any) => c.contactListdetailsId)
          }
          const payload = {
            contactListId: this.contactListId,
            contactListIds: contactListIds
          }
          if(!this.isTag) {payload.contactListId = this.contactListId}
      if (payload.contactListIds.length > 0) {
        this._helper.startSpinner();
        const operation = this.isTag ? 'deleteContactList' : 'deleteContactListDetail'
      console.log(payload)
        this._communication[operation](payload).subscribe({
          next: (res: any) => {
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            this._helper.triggerSucessAlert('Course created successfully!!!')
            if(this.isTag) {
              this.getAllContactList(this.announcementType);
            } else {
              this.getContactListById(this.contactListId)
            }
          } else {
            this._helper.stopSpinner();
            this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
          }
          },
          error: (error: HttpErrorResponse) => {
            this._helper.stopSpinner();
            console.log(error);
          },
        });
      }
        }
    })
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
          this.contactLists.push(event.editObject);
        }
      }
    );
  }

  public openEditContactDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(UpdateContactDeatilDialogComponent, {
      data: object,
    });
    console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
         
        } else {
          this.contactLists.push(event.editObject);
        }
      }
    );
  }

  goBack() {
    this.isTag = true;
  }

}

