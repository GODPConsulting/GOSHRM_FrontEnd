import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.css']
})
export class RightNavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  viewEvents() {
    this.router.navigate(['/events'])
  }
}
