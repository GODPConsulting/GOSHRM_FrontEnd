import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isOpen: boolean = false;
  public showMinimizedMenu: boolean = false;
  public loggedInUser: any;

  @Output() showMinimized = new EventEmitter();
  constructor(
    private _currentUser: CurrentUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this._currentUser.getUser();
  }

  public toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    if (this.showMinimizedMenu) {
      this.showMinimized.emit(true);
    }
  }
  public minimizeMenu(): void {
    this.showMinimizedMenu = !this.showMinimizedMenu;
    this.showMinimized.emit(this.showMinimizedMenu);
  }

  public logout(): void {
    this._currentUser.logOut();
    this.router.navigate(['/authentication'])
  }
}
