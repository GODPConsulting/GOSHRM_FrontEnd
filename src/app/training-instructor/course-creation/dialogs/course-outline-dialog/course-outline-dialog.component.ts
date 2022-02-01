
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
  selector: 'app-course-outline-dialog',
  templateUrl: './course-outline-dialog.component.html',
  styleUrls: ['./course-outline-dialog.component.scss']
})

export class CourseOutlineDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public reviewerForm!: FormGroup;
  public isLoading: boolean =false;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<CourseOutlineDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initCourseOutlineForm();
  }

  public initCourseOutlineForm() {
    this.reviewerForm = this.fb.group({
      section_Name: ['', Validators.required],
      outline_Name: ['', Validators.required],
      outline_Description: ['', Validators.required],
      sectionId: ['', Validators.required],
    })
  }

  public submit(): void {
    this.isLoading = true;
  }

}

