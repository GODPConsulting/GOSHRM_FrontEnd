import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DialogModel } from '@shared/components/models/dialog.model';
import { QuestionDialogComponent } from '../../dialogs/question-dialog/question-dialog.component';

@Component({
  selector: 'app-instructor-community',
  templateUrl: './instructor-community.component.html',
  styleUrls: ['./instructor-community.component.scss']
})
export class InstructorCommunityComponent implements OnInit {
  public showReply: boolean = false;
  public showSubReply: boolean = false;
  public htmlContent = ``;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    // height: '2rem',
    minHeight: '3rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  showQuestionReply() {
    this.showReply = !this.showReply
  }

  showQuestionSubReply() {
    this.showSubReply = !this.showSubReply
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
