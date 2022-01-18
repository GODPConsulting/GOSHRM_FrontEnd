import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
})
export class OfflineComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}
  public retry(): void {
    this._location.back();
  }
}
