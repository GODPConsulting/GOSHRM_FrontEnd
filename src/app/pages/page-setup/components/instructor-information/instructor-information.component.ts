import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { InstructorInformationService } from '../../services/instructor-information.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEmpDependentComponent } from '../../dialogs/add-emp-dependent/add-emp-dependent.component';
import { ActionsService } from '@shared/services/action.service';

@Component({
  selector: 'app-instructor-information',
  templateUrl: './instructor-information.component.html',
  styleUrls: ['./instructor-information.component.scss']
})
export class InstructorInformationComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public modalSub: Subscription = new Subscription();
  public instructor: any[] = [];
  public selectedInstructor: any[] = [];
  public selectedIds: number[] = [];
  public isFetchngFacilitatorDetail: boolean = false;
  public facilitatorFormSubmitted: boolean = false;
  public loggedInUser: any;
  public instructorId: any;
  public viewHeight: string = '500px';

  constructor(
    private _instructor: InstructorInformationService,
    private _currenService: CurrentUserService,
    private _base: BaseComponent,
    private _helper: HelperService,
    private _route: ActivatedRoute,
    private dialog: MatDialog,
    private _action: ActionsService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currenService.getUser();
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    this.getFacilitator();
    this.modalSub = this._action.triggerModalEvent.subscribe((event) => {
      event ? this.openDialog(false) : this.delete(this.selectedInstructor);
    })
  }

  public getFacilitator(): void {
    this._helper.startSpinner();
    this.isFetchngFacilitatorDetail = true;
    this.sub.add(
      this._instructor.getPageContent(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatorDetail = false;
          if(res['pageContentSetupTypes']) {
            this.instructor = res['pageContentSetupTypes'];
            console.log(res, this.instructor)
          }
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatorDetail = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(AddEmpDependentComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
       this.getFacilitator()
      }
    );
  }

  public delete(selectedInstructor: any): void {
    this.selectedInstructor = selectedInstructor;
    if (this.selectedInstructor?.length === 0) {
      this._helper.triggerWarningAlert('GOSLMS', 'Select items to delete')
    } else {
      this.deleteAction();
    }

  }

  public deleteAction() {
    this._helper.startSpinner();
    let payload: object;
    this.selectedInstructor?.map((item) => {
      this.selectedIds.push(item.id);
    });
    payload = {
      id: this.selectedIds,
    };
    this._instructor.deleteContent(payload).subscribe(
      (res: any) => {
        this._helper.stopSpinner();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
          this.getFacilitator();
        } else {
          this._helper.triggerErrorAlert(message)
        }
      },
      (err) => {
        this._helper.stopSpinner();
        const message = err.error?.status?.message.friendlyMessage;
        this._helper.triggerErrorAlert(message)
      }
    );
    this.selectedIds = this.selectedInstructor = [];
  }

  getBase64(event: any, item: number) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.uploadImage(reader.result, item);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  public uploadImage(fileName: any, pageContentId: number): void {
    this._helper.startSpinner();
    this.facilitatorFormSubmitted = true;
    const imageUrl = fileName.split(",");
    const payload  = {
      photoUrl: imageUrl[1],
      pageId: pageContentId,
      PageType: 1,
      companyId: this.loggedInUser.companyId
    };
    if (imageUrl) {
      this._instructor.uploadContentImage(payload).subscribe({
        next: (res: ResponseModel<any>) => {
          this._helper.stopSpinner();
          // console.log(res);
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
          this.getFacilitator();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this._helper.stopSpinner();
          this.facilitatorFormSubmitted = false;
        },
      });
    }
  }

}
