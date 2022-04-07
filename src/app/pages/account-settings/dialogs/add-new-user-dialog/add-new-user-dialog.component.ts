// import { Component, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-add-new-user-dialog',
//   templateUrl: './add-new-user-dialog.component.html',
//   styleUrls: ['./add-new-user-dialog.component.scss']
// })
// export class AddNewUserDialogComponent implements OnInit {
//   public addNewUser!: FormGroup;
//   public isLoading: boolean = false;
//   constructor() { }

//   ngOnInit(): void {
//   }

//   submit() {

//   }

// }

import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new-user-dialog',
  templateUrl: './add-new-user-dialog.component.html',
  styleUrls: ['./add-new-user-dialog.component.scss']
})

export class AddNewUserDialogComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public addNewUser!: FormGroup;
  public isLoading: boolean = false;
  public sub: Subscription = new Subscription();
  public loggedInUser: any;
  public accessType: any[] = [
    {id: 1, name: 'View'},
    {id: 1, name: 'Add'},
    {id: 1, name: 'Edit'},
    {id: 1, name: 'Delete'},
  ];
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    public dialogRef: MatDialogRef<AddNewUserDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    public fb: FormBuilder,
    public _base: BaseComponent,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit() {
    this.loggedInUser = this._currentService.getUser();
  }


  submit() {
   
  }

}


