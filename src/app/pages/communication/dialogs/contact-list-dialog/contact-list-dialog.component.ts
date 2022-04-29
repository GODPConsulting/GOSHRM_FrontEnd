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
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '@auth/services/auth.service';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { InitialSearchDTO, ResponseModel, SearchDTO } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { CourseCreationService } from 'app/pages/course-creation/services/course-creation.service';
import { Subscription } from 'rxjs';
import { AnnouncementType } from '../../models/communication.model';
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
  public courses: Courses[] = [];
  public isFetchingParticipant: boolean = false;
  public isFetchingCourses: boolean = false;
  public loggedInUser: any;
  public searchQuery: SearchDTO = { ...InitialSearchDTO, search: '' };
  public isInitialRequest: boolean = true;
  public createdBy: any;
  public loggedInId: any;
  
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
    private _communication: CommunicationService,
    private _course: CourseCreationService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._current.getUser();
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
      this.loggedInId = this.loggedInUser.trainingProviderId
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
      this.loggedInId = this.loggedInUser.trainingInstructorId
    }
      this.initaddTagForm();
      this.getParticipants();
      this.getAllCourses(true);
  }

  public getAllCourses(
    initial: boolean,
    isPagination?: boolean,
    pageEvent?: PageEvent
  ): void {
    if (pageEvent) {
      this.searchQuery = {
        search: this.searchQuery?.search,
        pageNumber: pageEvent?.pageIndex + 1,
        pageSize: pageEvent?.pageSize,
      };
    }
    initial ? (this.isInitialRequest = true) : (this.isInitialRequest = false);
    const payload = {
      searchParams: this.searchQuery.search,
      id: this.loggedInId,
      type: this.createdBy
    }
    this._helper.startSpinner();
    this.isFetchingCourses = true;
    this.sub.add(
      this._course.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this.isFetchingCourses = false;
          this._helper.stopSpinner();
          // this.paginatedResponse = res?.response;
          this.courses = res['course_CreationSetupTypes'];

          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingCourses = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
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
      tagName: [this.data?.editObject?.tagName ? this.data?.editObject?.tagName : '', Validators.required],
      courseId: [this.data?.editObject?.courseId? this.data?.editObject?.courseId : 0, Validators.required],
      contactListId: [this.data?.editObject?.contactListId ? this.data?.editObject?.contactListId : 0, Validators.required],
      contactListType: [AnnouncementType.Promotional, Validators.required],
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
   this._helper.startSpinner();
   console.log(payload);
   this.sub.add(
    this._communication.addContactList(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          if(!this.data.isEditing) {
            payload.totalEmail = payload.contactListDetails.length;
            payload.updatedAt = new Date();
          }
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

