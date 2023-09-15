import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public instructorId: any;
  public current_tab:number = 1;
  public canAddDelete!: boolean;
  public loggedInUser!: any;
  public userActivities: any;

  constructor(
    private router: Router,
    private _current: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.userActivities = this.loggedInUser.activities.find((a: any) => {
      return a.name === 'PageSetup';
    });
    (this.router.url === '/page-setup/banner') ?
      this.canAddDelete = false :
      this.canAddDelete = true;
  }

  toggleTab(canAddDelete: boolean) {
    this.canAddDelete = canAddDelete;
  }

}
