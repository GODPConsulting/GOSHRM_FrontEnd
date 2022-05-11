import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogModel } from '@shared/components/models/dialog.model';
import { QuestionDialogComponent } from '../../dialogs/question-dialog/question-dialog.component';

@Component({
  selector: 'app-qa-layout',
  templateUrl: './qa-layout.component.html',
  styleUrls: ['./qa-layout.component.scss']
})
export class QaLayoutComponent implements OnInit {
  public courseId: any;
  
  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const route = this._route.snapshot.paramMap.get('courseId');
    this.courseId = route;
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: object,
    });
    console.log(payload);
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {

      }
    );
  }

}
