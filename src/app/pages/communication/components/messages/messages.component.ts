import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public current_tab: string = 'all';
  public loggedInUser: any;
  public courseId: any;

  constructor(
    private router: Router,
    private _current: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
  }

  public getAll(): void {
    this.current_tab = 'all';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'all' } });
  }

  public getParticipant(): void {
    this.current_tab = 'participants';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'participants' } });
  }

  public getFacilitator(): void {
    this.current_tab = 'facilitator';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'facilitator' } });
  }

  public getAdmin(): void {
    this.current_tab = 'admin';
    this.router.navigate(['/communication/messages'], { queryParams: { q: 'admin' } });
  }

  public openMessager(){
    let messager = document.getElementById('messager');
    if(messager?.classList.contains('d-none')) {
      messager.classList.remove('d-none');
    } else {
      messager?.classList.add('d-none');
    }
  }

}
