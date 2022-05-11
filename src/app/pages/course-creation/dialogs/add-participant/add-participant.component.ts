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
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss']
})
export class AddParticipantComponent implements OnInit {
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
  public newParticipant = (participant: any) => (
      { 
        participantName: participant,
        emailAddress: '',
        phoneNumber: ''
      });
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<AddParticipantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    private _helper: HelperService,
    private _course: CourseCreationService,
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
          // console.log(res, this.allParticipants);
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
     courseId: [+this.data?.editObject?.courseId, Validators.required],
     participantScheduleType: [2],
     participants: this.fb.array([
       this.fb.group({
        participantId: [0],
        participantEmailAddress: [''],
        participantPhoneNumber: ['']
       })
     ])
    })
  }

  public selectParticipant() {
    const getParticipant = this.allParticipantsNames;
    // console.log(getParticipant);
    let recipient = this.allParticipants.filter((m: any) => {
       return getParticipant.find((user: any) => {
          return m.emailAddress === user
        })
    });
    let filteredEmail = recipient.map((n: any) => {
      return n.emailAddress
    })
    let filteredPhone = recipient.map((n: any) => {
      return n.emailAddress
    })
    this.allParticipantsEmail.push(filteredEmail);
    this.allParticipantsPhone.push(filteredPhone);
    // console.log(recipient)
  }


  public submit() {
    this._helper.startSpinner();
    const payload = this.addPrticipantForm.value;
    let participants = [];
    let participant = this.allParticipants.filter((m: any) => {
      return this.allParticipantsNames.find((n: any) => {
        return n === m.emailAddress
      })
    })
    let newUser = participant.map((m: any) => {
      return {
        participantId: m.participantId,
        participantEmailAddress: m.emailAddress,
        participantPhoneNumber: m.phoneNumber
      }
    })
    participants.push(newUser);
    payload.participants = participants[0];
    // console.log(payload);
    this.sub.add(
      this._course.AddcourseParticipant(payload).subscribe({
        next: (res: any) => {
          // console.log(res);
          if(res.status.isSuccessful) {
            this._helper.stopSpinner();
            if (this.data?.isEditing) {
              payload.competenceId = payload?.competenceId;
              payload.deleted = false;
            } else {
              payload.competenceId = res;
            }
            this.event.emit({
              isEditing: this.data?.isEditing,
              editObject: payload,
            });
            this.close.nativeElement.click();
            this._helper.triggerSucessAlert('Course participant added successfully!!!')
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

