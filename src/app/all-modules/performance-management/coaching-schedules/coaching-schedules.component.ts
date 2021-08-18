import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { PerformanceManagementService } from "../../../services/performance-management.service";

@Component({
  selector: "app-coaching-schedules",
  templateUrl: "./coaching-schedules.component.html",
  styleUrls: ["./coaching-schedules.component.css"],
})
export class CoachingSchedulesComponent implements OnInit {
  coachingList$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private performanceManagementService: PerformanceManagementService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.coachingList$ = this.performanceManagementService.getCoachingSchedule(
        param.revieweeId,
        param.companyId
      );
    });
  }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
