import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-payout",
  templateUrl: "./payout.component.html",
  styleUrls: ["./payout.component.css"],
})

export class PayoutComponent implements OnInit {
   public spinner: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}

  openAccountModal() {
    $("#account-modal").modal("show");
  }

  closeAccountModal() {
    $("#account-modal").modal("hide");
  }
  
}
