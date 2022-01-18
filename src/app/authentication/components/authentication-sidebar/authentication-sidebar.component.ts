import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication-sidebar',
  templateUrl: './authentication-sidebar.component.html',
  styleUrls: ['./authentication-sidebar.component.scss']
})
export class AuthenticationSidebarComponent implements OnInit {
  @Input() sidebartitle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
