import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  public profile: any;

  constructor(
    private router: Router,
    private _current: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.profile = this._current.getUser();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
