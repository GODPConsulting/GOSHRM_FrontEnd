import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.css"],
})

export class PolicyComponent implements OnInit {
   public spinner: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}
  
}
