import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public instructorId: any;
  public current_tab:number = 1;

  constructor(

  ) { }

  ngOnInit(): void {

  }

  toggleTab(tab: number) {
    this.current_tab = tab;
  }

}
