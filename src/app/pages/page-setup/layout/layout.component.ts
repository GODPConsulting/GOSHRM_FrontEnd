import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public instructorId: any;
  public current_tab:number = 1;
  public canAddDelete!: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    (this.router.url === '/page-setup/banner') ?
      this.canAddDelete = false :
      this.canAddDelete = true;
  }

  toggleTab(canAddDelete: boolean) {
    this.canAddDelete = canAddDelete;
  }

}
