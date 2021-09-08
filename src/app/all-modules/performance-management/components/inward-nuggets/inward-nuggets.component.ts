import { Component, Input, OnInit } from "@angular/core";
import { KudosFeedback } from "../../../../interface/interfaces";

@Component({
  selector: "app-inward-nuggets",
  templateUrl: "./inward-nuggets.component.html",
  styleUrls: ["./inward-nuggets.component.css"],
})
export class InwardNuggetsComponent implements OnInit {
  @Input() icomingFeedbacks: KudosFeedback[];
  constructor() {}

  ngOnInit(): void {}
}
