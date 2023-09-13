import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public canAddDelete: boolean = true;
  public canUploadDownload: boolean = true;
  public canGrid: boolean = true;
  public canAllocate: boolean = false;
  public currentPage!: string;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  public nextTab(
    canUploadDownload: boolean,
    canAddDelete?: boolean,
    canGrid?: boolean,
    canAllocate?: boolean
  ) {
    this.canAddDelete = canAddDelete!;
    this.canGrid = canGrid!;
    this.canUploadDownload = canUploadDownload;
    this.canAllocate = canAllocate!;
  }

  public filterAction(event: any) {

  }

  goBack() {
    history.back()
  }


}
