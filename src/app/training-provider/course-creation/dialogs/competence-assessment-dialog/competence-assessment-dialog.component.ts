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
  selector: 'app-competence-assessment-dialog',
  templateUrl: './competence-assessment-dialog.component.html',
  styleUrls: ['./competence-assessment-dialog.component.scss']
})

export class CompetenceAssessmentDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public payoutForm!: FormGroup;
  public isLoading: boolean =false;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<CompetenceAssessmentDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initPayoutForm();
  }

  public initPayoutForm() {
    this.payoutForm = this.fb.group({
      payoutIndex: this.fb.array([
        this.fb.group({
          account_Type: ['', [Validators.required]],
          account_Email: ['', [Validators.required]],
          account_Type_Name: ['', [Validators.required]],
        })
      ])
    })
  }


  public submit(): void {
    this.isLoading = true;
  }

}
