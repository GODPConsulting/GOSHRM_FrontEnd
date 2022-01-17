import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-app-setup",
  templateUrl: "./app-setup.component.html",
  styleUrls: ["./app-setup.component.css"],
})

export class AppSetupComponent implements OnInit {
   public spinner: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}

}
