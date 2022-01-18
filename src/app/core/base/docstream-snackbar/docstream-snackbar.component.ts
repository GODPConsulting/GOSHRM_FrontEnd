import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { SnackType } from '@core/models/snack.model';

@Component({
  selector: 'app-docstream-snackbar',
  templateUrl: './docstream-snackbar.component.html',
  styleUrls: ['./docstream-snackbar.component.scss'],
})
export class DocstreamSnackbarComponent implements OnInit {
  public snackType = SnackType;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackRef: MatSnackBarRef<DocstreamSnackbarComponent>
  ) {
    console.log(data);
  }

  ngOnInit(): void {}

  public dismiss(): void {
    this._snackRef.dismiss();
  }
}
