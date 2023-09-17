import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ActionsService } from '@shared/services/action.service';
import { Subscription } from 'rxjs';
import { IndustryDialogComponent } from '../../dialogs/industry-dialog/industry-dialog.component';
import { SetupService } from '../../services/setup.service';
import { HelperService } from '@core/services/healper.service';
import swal from 'sweetalert2';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ResponseModel } from 'app/models/response.model';
import { UtilityService } from '@shared/services/utility.service';
import { UploadExcelDialogComponent } from '@shared/dialogs/upload-excel-dialog/upload-excel-dialog.component';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss']
})
export class IndustryComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public modalSubscription: Subscription = new Subscription();
  public actionSubscription: Subscription = new Subscription();
  public isfetchingIndustry!: boolean;
  public industries: any[] = [];
  public selectedIndustires: any[] = [];
  public selectedIds: any[] = [];
  public viewHeight = '550px';

  constructor(
    private _action: ActionsService,
    private dialog: MatDialog,
    private _setup: SetupService,
    private _helper: HelperService,
    private utilitiesService: UtilityService
  ) { }

  ngOnInit(): void {
    this.modalSubscription.add(this._action.triggerModalEvent.subscribe((event)=> {
      event ? this.openDialog(false) : this.delete();
    }));
    this.actionSubscription.add(this._action.downloadEvent.subscribe((event)=> {
      event ? this.downloadIndustry() : this.openUploadDialog({ isEditing: true, editObject: {endpoint: '/setup/upload/industry', name: 'Industry', format: 'industry'} });
    }));
    this.getAllIndustries();
  }

  public getAllIndustries() {
    this._helper.startSpinner();
    this.isfetchingIndustry = true,
    this.sub.add(
      this._setup.getIndustries().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isfetchingIndustry = false;
          this.industries = res;
        },
        error: (err) => {
          this._helper.stopSpinner();
          this.isfetchingIndustry = false;
        }
      })
    )
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(IndustryDialogComponent, {
      data: object,
      panelClass: 'modal-width'
    });
    // console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        this.getAllIndustries();
      }
    );
  }

  public delete(): void {
    if (this.selectedIndustires?.length === 0) {
      swal.fire("Error", "Select items to delete", "error");
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.height = '350px';
      dialogConfig.width = '600px';
      dialogConfig.data = {
        title: 'Confirm Action',
        modalMessage: `Are you sure you want to delete`,
        actionButtonText: `Yes, Delete`,
      };
      const dialogRef = this.dialog.open(
        ConfirmationModalComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteAction();
        }
      });
    }

  }

  public downloadIndustry(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._setup.downloadIndustry().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.utilitiesService.byteToFile(res, "industry.xlsx");
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public openUploadDialog(
    data: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = data;
    const dialogRef = this.dialog.open(UploadExcelDialogComponent, {
      data: object,
      panelClass: 'modal-width'
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.getAllIndustries();
      }
    );
  }

  public deleteAction() {
    this._helper.startSpinner();
    let payload: object;
    this.selectedIndustires?.map((item) => {
      this.selectedIds.push(item.industryId);
    });
    payload = {
      ids: this.selectedIds,
    };
    this._setup.deleteIndustry(payload).subscribe(
      (res: any) => {
        this._helper.stopSpinner();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
          })
          this.getAllIndustries();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this._helper.stopSpinner();
        const message = err.error?.status?.message?.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
    this.selectedIds = this.selectedIndustires = [];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.modalSubscription.unsubscribe();
  }

}
