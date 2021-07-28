import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-feedback-kudos",
  templateUrl: "./feedback-kudos.component.html",
  styleUrls: ["./feedback-kudos.component.css"],
})
export class FeedbackKudosComponent implements OnInit {
  feedbacks$: Observable<any[]>;

  constructor() {}

  ngOnInit(): void {}

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {}
}
