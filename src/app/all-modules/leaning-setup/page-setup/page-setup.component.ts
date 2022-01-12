import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-page-setup",
  templateUrl: "./page-setup.component.html",
  styleUrls: ["./page-setup.component.css"],
})

export class PageSetupComponent implements OnInit {
  public enableForm: boolean = false;
  public spinner: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}

  editForm() {
    this.enableForm = !this.enableForm;
    console.log(this.enableForm)
  }

}
