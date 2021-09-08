import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { JwtService } from "../../../services/jwt.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-feedback-kudos",
  templateUrl: "./feedback-kudos.component.html",
  styleUrls: ["./feedback-kudos.component.css"],
})
export class FeedbackKudosComponent implements OnInit {
  feedbacks$: Observable<any[]>;
  reviewPeriod$: Observable<unknown>;
  activeIndex: number = 0;

  constructor(
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((user) => {
      this.reviewPeriod$ = this.performanceManagementService.getOpenCycle(
        user.companyId
      );
      // this.performanceManagementService
      //   .getKudos(user.employeeId, user.companyId)
      //   .subscribe((res) => {
      //     console.log(res);
      //   });
      this.feedbacks$ = this.performanceManagementService.getKudos(
        user.employeeId,
        user.companyId
      );
    });
  }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {}

  viewKudos(item) {
    if (item.submitted == "Yes") {
      return;
    }
    this.router.navigate(["/performance/add-kudos"], {
      queryParams: {
        id: item.appraisalNuggetId,
      },
    });
  }

  tabChange(event: any) {
    this.activeIndex = event.index;
  }
}
