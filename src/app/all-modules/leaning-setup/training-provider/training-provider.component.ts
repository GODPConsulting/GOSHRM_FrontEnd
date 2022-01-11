import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-training-provider",
  templateUrl: "./training-provider.component.html",
  styleUrls: ["./training-provider.component.css"],
})

export class TrainingProviderComponent implements OnInit {
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}
  
}
