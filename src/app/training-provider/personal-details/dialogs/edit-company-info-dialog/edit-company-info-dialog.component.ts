import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';

@Component({
  selector: 'app-edit-company-info-dialog',
  templateUrl: './edit-company-info-dialog.component.html',
  styleUrls: ['./edit-company-info-dialog.component.scss'],
})
export class EditCompanyInfoDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public updateProfileForm!: FormGroup;
  public isLoading: boolean =false;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<EditCompanyInfoDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<string>,
  ) { }

  ngOnInit() {

  }


  public submit(): void {
    this.isLoading = true;
  }

}
