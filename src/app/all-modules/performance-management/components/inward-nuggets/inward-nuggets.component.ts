import { Component, Input, OnInit } from "@angular/core";
import { KudosFeedback } from "../../../../interface/interfaces";
declare const $: any;

@Component({
  selector: "app-inward-nuggets",
  templateUrl: "./inward-nuggets.component.html",
  styleUrls: ["./inward-nuggets.component.css"],
})
export class InwardNuggetsComponent implements OnInit {
  @Input() icomingFeedbacks: KudosFeedback[];
  constructor() {}

  ngOnInit(): void {}

  addFeedback() {
    $("#feedback_modal").modal("show");
  }

  closeFeedbackModal() {
    $("#feedback_modal").modal("hide");
  }
}
