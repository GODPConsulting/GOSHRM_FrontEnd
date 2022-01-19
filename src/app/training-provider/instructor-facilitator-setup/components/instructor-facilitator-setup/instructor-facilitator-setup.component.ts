import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { AddInstructorDialogComponent } from '../../dialogs/add-instructor-dialog/add-instructor-dialog.component';

@Component({
  selector: 'app-instructor-facilitator-setup',
  templateUrl: './instructor-facilitator-setup.component.html',
  styleUrls: ['./instructor-facilitator-setup.component.scss']
})
export class InstructorFacilitatorSetupComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
          
      }
    );
  }

}
