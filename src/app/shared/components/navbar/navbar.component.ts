import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public loggedInUser: any;

  constructor(
    private router: Router,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
  }

  public logout(): void {
   this._currentService.logOut();
    this.router.navigate(['/authentication'])
  }

}
