import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth/services/auth.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-contact-list-dialog',
  templateUrl: './contact-list-dialog.component.html',
  styleUrls: ['./contact-list-dialog.component.scss']
})
export class ContactListDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public addTagForm!: FormGroup;
  public isLoading: boolean = false;
  public allParticipants: any[] = [];
  public isFetchingParticipant: boolean = false;
  public loggedInUser: any;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<ContactListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    private _helper: HelperService,
    private _auth: AuthService,
    private _current: CurrentUserService,
    private _communication: CommunicationService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    this.initaddTagForm();
    this.getParticipants();
  }

  public getParticipants(): void {
    this.isFetchingParticipant = true;
    this._helper.startSpinner();
    this.sub.add(
      this._auth.getAllParticipants(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingParticipant = false;
          this.allParticipants = res['trainingParticipant_objs'];
          console.log(res, this.allParticipants);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingParticipant = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public initaddTagForm() {
    this.addTagForm = this.fb.group({
      tagName: ['', Validators.required],
      contactListId: [0, Validators.required],
      contactListType: [0, Validators.required],
      contactListDetails: this.fb.array([
       this.fb.group({
        contactListDetailsId: [0],
        name: [''],
        email: ['']
       })
      ])
    })
  }

  get newForm(): FormArray {
    return this.addTagForm.get('contactListDetails') as FormArray;
  }

  addUser() {
    let user = this.fb.group(new Contact());
		this.newForm.push(user);
  }

  public userSelected(event: any){
    console.log(event)
    var sel_user = this.allParticipants.find((c) =>{
      return c.participantName == event.value;
    })
    if(sel_user){
      console.log(sel_user);
    }
  }

  public submit() {
   const payload = this.addTagForm.value;
   const operation = this.data.isEditing ? 'addContactList' : 'addContactList';
   this._helper.startSpinner();
   console.log(payload);
   this.sub.add(
    this._communication[operation](payload).subscribe({
      next: (res: any) => {
        console.log(res);
        if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          payload.totalEmail = payload.contactListDetails.length;
          payload.updatedAt = new Date();
          this.event.emit({
            isEditing: this.data?.isEditing,
            editObject: payload,
          });
          this.close.nativeElement.click();
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

export class Contact {
	contactListDetailsId = 0;
	name = ''; 
	email = '';
} 

