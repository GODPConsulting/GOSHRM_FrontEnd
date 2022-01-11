import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-email-setup",
  templateUrl: "./email-setup.component.html",
  styleUrls: ["./email-setup.component.css"],
})

export class EmailSetupComponent implements OnInit {
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}
  
}
