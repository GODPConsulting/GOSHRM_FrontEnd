import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public instructorId: any;
  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
  }

}
