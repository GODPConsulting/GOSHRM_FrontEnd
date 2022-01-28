import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})

export class QuestionDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public questionForm!: FormGroup;
  public isLoading: boolean =false;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initReviewerForm();
  }

  public initReviewerForm() {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      conversation: ['', Validators.required]
    })
  }

  public submit(): void {
    this.isLoading = true;
  }

}


