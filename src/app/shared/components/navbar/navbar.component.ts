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
  public user: string = '';

  constructor(
    private router: Router,
    private _currentService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    if(this.loggedInUser.customerTypeId === 1) {
      this.user = 'Provider'
    } else if(this.loggedInUser.customerTypeId === 2) {
      this.user = 'Instructor'
    } else {
      this.user = 'Participant'
    }
  }

  public logout(): void {
   this._currentService.logOut();
    this.router.navigate(['/authentication'])
  }

}
