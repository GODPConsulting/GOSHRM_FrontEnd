import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';

@Component({
  selector: 'app-add-instructor-dialog',
  templateUrl: './add-instructor-dialog.component.html',
  styleUrls: ['./add-instructor-dialog.component.scss']
})

export class AddInstructorDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public addFacilitatorForm!: FormGroup;
  public isLoading: boolean =false;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<AddInstructorDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.addNewFacilitatorForm();
  }

  public addNewFacilitatorForm() {
    this.addFacilitatorForm = this.fb.group({
      username: [''],
      bio: [''],
      linkedIn_Link: [''],
      twitter_Link: [''],
      image: [''],
      addCourseIndex: this.fb.array([
        this.fb.group({
            course_Name: [''],
            difficulty_Level: [''],
            duration: [''],
            date: [''],
        })
      ])
    })
  }

  get facilitatorItems() {
    return this.addFacilitatorForm.get('addCourseIndex') as FormArray;
  }

  public addNewCourse() {
    this.facilitatorItems.push(this.fb.group({
        course_Name: [''],
        difficulty_Level: [''],
        duration: [''],
        date: [''],
    }))
  }

  public removeCourse(i: number) {
    if(i === 0) {return;}
    this.facilitatorItems.removeAt(i);
  }


  public submit(): void {
    this.isLoading = true;
  }

}

