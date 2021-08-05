import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { JwtService } from "../../../services/jwt.service";

@Component({
  selector: "app-feedback-kudos",
  templateUrl: "./feedback-kudos.component.html",
  styleUrls: ["./feedback-kudos.component.css"],
})
export class FeedbackKudosComponent implements OnInit {
  feedbacks$: Observable<any[]>;
  reviewPeriod$: Observable<unknown>;
  constructor(
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((user) => {
      this.reviewPeriod$ = this.performanceManagementService.getOpenCycle(
        user.companyId
      );
    });
  }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {}
}
