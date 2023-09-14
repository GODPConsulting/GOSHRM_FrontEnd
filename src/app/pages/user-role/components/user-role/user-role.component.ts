import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ActionsService } from '@shared/services/action.service';
import { Subscription } from 'rxjs';
import { HelperService } from '@core/services/healper.service';
import swal from 'sweetalert2';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { UserRoleService } from '../../services/user-role.service';
import { UserRoleDialogComponent } from '../../dialogs/user-role-dialog/user-role-dialog.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public modalSubscription: Subscription = new Subscription();
  public isfetchingIndustry!: boolean;
  public industries: any[] = [];
  public selectedIndustires: any[] = [];
  public selectedIds: any[] = [];
  public viewHeight = '550px';

  constructor(
    private _action: ActionsService,
    private dialog: MatDialog,
    private _userRole: UserRoleService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.modalSubscription.add(this._action.triggerModalEvent.subscribe((event)=> {
      event ? this.openDialog(false) : this.delete();
    }));
    this.getAllUserRoles();
  }

  public getAllUserRoles() {
    this._helper.startSpinner();
    this.isfetchingIndustry = true,
    this.sub.add(
      this._userRole.getAllUserRoles().subscribe({
        next: (res: any) => {
          // console.log(res);
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
    const dialogRef = this.dialog.open(UserRoleDialogComponent, {
      data: object,
      panelClass: 'modal-width'
    });
    // console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        this.getAllUserRoles();
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

  public deleteAction() {
    this._helper.startSpinner();
    let payload: object;
    this.selectedIndustires?.map((item) => {
      this.selectedIds.push(item.userRoleId);
    });
    payload = {
      ids: this.selectedIds,
    };
    this._userRole.deleteUserRole(payload).subscribe(
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
          this.getAllUserRoles();
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
