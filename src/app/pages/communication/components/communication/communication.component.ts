import { Component, OnInit } from '@angular/core';
import {
  InitialSearchDTO,
  // PaginationResponse,
  ResponseModel,
  SearchDTO,
} from 'app/models/response.model';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';
import { PageEvent } from '@angular/material/paginator';
import { DialogModel } from '@shared/components/models/dialog.model';
import { QuestionDialogComponent } from '../../dialogs/question-dialog/question-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public questionCourses: any[] = [];
  public courses: any[] = [];
  public isFetchingCourses:boolean = false;
  public loggedInUser: any;
  public loggedInId!: number;
  public createdBy!: number;
  public isInitialRequest: boolean = true;
  public searchQuery: SearchDTO = { ...InitialSearchDTO, search: '' };
  public deliveryType: string = '';
  public sessionType: string = '';
  
  constructor(
    public dialog: MatDialog,
    private _communication: CommunicationService,
    public _helper: HelperService,
    private _current: CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
      this.loggedInId = this.loggedInUser.trainingProviderId
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
      this.loggedInId = this.loggedInUser.trainingInstructorId
    }
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
    this.isFetchingCourses = true;
    this.sub.add(
      this._communication.getAllCourses(payload).subscribe({
        next: (res: any) => {
          this.isFetchingCourses = false;
          // this.paginatedResponse = res?.response;
          this.courses = res['courses'];

          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public getSearchQuery(searchQuery: string): void {
    this.searchQuery.search = searchQuery;
    console.log(this.searchQuery.search)
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          
      }
    );
  }

}

