import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { AddInstructorDialogComponent } from '../../dialogs/add-instructor-dialog/add-instructor-dialog.component';
import { Facilitator } from '../../models/instructor.model';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-instructor-facilitator-setup',
  templateUrl: './instructor-facilitator-setup.component.html',
  styleUrls: ['./instructor-facilitator-setup.component.scss']
})
export class InstructorFacilitatorSetupComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public instructors: Facilitator[] = [];
  public isFetchngFacilitatorDetail: boolean = false;
  public loggedInUser: any;
  public selectedInstructors: Facilitator[] = [];

  constructor(
    public dialog: MatDialog,
    private _currentService: CurrentUserService,
    private _instructor: InstructorService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.getFacilitators();
  }

  public getFacilitators(): void {
    this._helper.startSpinner();
    this.isFetchngFacilitatorDetail = true;
    this.sub.add(
      this._instructor.getAllFaciltator().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatorDetail = false;
          this.instructors = res['training_InstructorSetupTypes'];
          console.log(res, this.instructors)
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
    const dialogRef = this.dialog.open(AddInstructorDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.instructors = [event?.editObject, ...this.instructors];
      }
    );
  }

  selectDeselectInstructor(payout: any) {
    this.selectedInstructors.includes(payout.payoutId)
      ? (this.selectedInstructors = this.selectedInstructors.filter(
          code => code != payout.payoutId
        ))
      : this.selectedInstructors.push(payout.payoutId);
    // console.log(this.selectedPayout);
  }

}
