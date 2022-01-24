import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { CompetenceAssessmentDialogComponent } from '../../dialogs/competence-assessment-dialog/competence-assessment-dialog.component';

@Component({
  selector: 'app-competence-assessment',
  templateUrl: './competence-assessment.component.html',
  styleUrls: ['./competence-assessment.component.scss']
})
export class CompetenceAssessmentComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(CompetenceAssessmentDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          console.log('Hi');
          
      }
    );
  }

}
