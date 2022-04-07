import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public showMinimized: boolean = false;
  public loggedinUser: any;
  
  constructor(
    private _current: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.loggedinUser = this._current.getUser();
  }

  public showMinimizedMenu(value: any): void {
    this.showMinimized = value;
  }
}
