import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public current_tab: string = 'all';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
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

}
