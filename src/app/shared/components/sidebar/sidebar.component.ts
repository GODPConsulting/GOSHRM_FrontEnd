import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isOpen: boolean = false;
  public showMinimizedMenu: boolean = false;

  @Output() showMinimized = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

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
    // this._currentUser.logOut();
  }
}
