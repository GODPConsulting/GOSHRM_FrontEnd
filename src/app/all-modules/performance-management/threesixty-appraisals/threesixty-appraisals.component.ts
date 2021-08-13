import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ThreesixtyFeedback } from "../../../interface/interfaces";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Router } from "@angular/router";
import { JwtService } from "../../../services/jwt.service";

@Component({
  selector: "app-threesixty-appraisals",
  templateUrl: "./threesixty-appraisals.component.html",
  styleUrls: ["./threesixty-appraisals.component.css"],
})
export class ThreesixtyAppraisalsComponent implements OnInit {
  feedbacks$: Observable<ThreesixtyFeedback[]>;
  constructor(
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((user) => {
      this.feedbacks$ = this.performanceManagementService.getThreeSixtyFeedbacks(
        user.employeeId,
        user.companyId
      );
    });
  }

  viewFeedback(item) {
    this.router.navigate(["/performance/360-appraisal"], {
      queryParams: {
        id: item.employeePerformanceFeedback360Id,
        employeeId: item.revieweeId,
        appraisalCycleId: item.appraisalcycleId,
        reviewerOneId: item.reviewerOneId,
      },
    });
  }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
