import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';
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
  public loggedInUser!: any;
  public userActivities: any;

  constructor(
    private _current: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.userActivities = this.loggedInUser.activities.find((a: any) => {
      return a.name === 'Setup';
    });
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
