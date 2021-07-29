import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-coaching-schedules",
  templateUrl: "./coaching-schedules.component.html",
  styleUrls: ["./coaching-schedules.component.css"],
})
export class CoachingSchedulesComponent implements OnInit {
  coachingList$: Observable<any>;

  constructor() {}

  ngOnInit(): void {}

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
