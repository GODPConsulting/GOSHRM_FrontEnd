import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ThreesixtyFeedback } from "../../../interface/interfaces";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-threesixty-appraisals",
  templateUrl: "./threesixty-appraisals.component.html",
  styleUrls: ["./threesixty-appraisals.component.css"],
})
export class ThreesixtyAppraisalsComponent implements OnInit {
  feedbacks$: Observable<ThreesixtyFeedback[]>;
  constructor(
    private performanceManagementService: PerformanceManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.feedbacks$ = this.performanceManagementService.getThreeSixtyFeedbacks();
  }

  // viewFeedback(item) {
  //   this.router.navigate(["/performance/360-appraisal"], {
  //     queryParams: {
  //       feedbackId: item.id,
  //     },
  //   });
  // }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
