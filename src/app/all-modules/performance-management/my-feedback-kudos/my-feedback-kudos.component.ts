import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-my-feedback-kudos",
  templateUrl: "./my-feedback-kudos.component.html",
  styleUrls: ["./my-feedback-kudos.component.css"],
})
export class MyFeedbackKudosComponent implements OnInit {
  feedbacks$: Observable<any[]>;

  constructor() {}

  ngOnInit(): void {}

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
