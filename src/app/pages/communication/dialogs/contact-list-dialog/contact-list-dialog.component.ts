import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth/services/auth.service';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list-dialog',
  templateUrl: './contact-list-dialog.component.html',
  styleUrls: ['./contact-list-dialog.component.scss']
})
export class ContactListDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public addPrticipantForm!: FormGroup;
  public isLoading: boolean = false;
  public allParticipants: any[] = [];
  public allParticipantsNames: any[] = [];
  public allParticipantsEmail: any[] = [];
  public allParticipantsPhone: any[] = [];
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
    private _current: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    this.initParticipantForm();
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

  public initParticipantForm() {
    this.addPrticipantForm = this.fb.group({
      name: [[], Validators.required],
      email: [[], Validators.required],
      phoneNo: [[], Validators.required]
    })
  }

  compareFn(item: any, selected: any) {
    console.log("ITEM", item);
    console.log("SELECTED", selected);
    return item.value === selected.value;
  }

  public selectParticipant() {
    const getParticipant = this.allParticipantsNames;
    // console.log(getParticipant);
    let recipient = this.allParticipants.filter((m: any) => {
       return getParticipant.find((user: any) => {
          return m.emailAddress === user
        })
    });
    console.log(recipient)
    // let email = recipient.map((m: any) => {
    //   return m.emailAddress
    // })
    // let phone = recipient.map((m: any) => {
    //   return m.phoneNumber
    // })
    // this.allParticipantsEmail.push(email);
    // this.allParticipantsPhone.push(phone);
    this.allParticipantsEmail = recipient;
    this.allParticipantsPhone  = recipient;
    // console.log(this.allParticipantsEmail)
    // console.log(this.allParticipantsPhone)
    this.addPrticipantForm = this.fb.group({
      name: [getParticipant, Validators.required],
      email: [this.allParticipantsEmail, Validators.required],
      phoneNo: [this.allParticipantsPhone, Validators.required]
    })
  }


  public submit() {
   
  }

}


