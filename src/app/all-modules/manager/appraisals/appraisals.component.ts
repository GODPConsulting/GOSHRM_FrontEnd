import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { ManagerService } from "../../../services/manager.service";
import { JwtService } from "../../../services/jwt.service";
import { LoadingService } from "../../../services/loading.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-appraisals",
  templateUrl: "./appraisals.component.html",
  styleUrls: ["./appraisals.component.css"],
})
export class AppraisalsComponent implements OnInit {
  public selectedId: number[] = [];
  public reportAppraisals: any[] = [];
  user: any;
  activities: any;
  jobGradeId: number;
  employeeId: number;
  deptId: number;
  constructor(
    private managerService: ManagerService,
    private jwtService: JwtService,
    private loadingService: LoadingService,
    private performanceManagementService: PerformanceManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((user) => {
      this.jobGradeId = user.jobGrade;
      this.employeeId = user.employeeId;
      this.deptId = user.departmentId;
      this.getAppraisalObjByManagerId();
    });

    this.activities = this.jwtService.getUserActivities();
    this.user = this.jwtService.getUserDetails();
    if (this.activities.includes("line manager")) {
      // this.getAppraisalObjByManagerId(this.user.staffId);
    }
  }

  getAppraisalObjByManagerId() {
    this.loadingService.show();
    this.performanceManagementService
      .getReviewersAppraisals(this.employeeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.reportAppraisals = data;
        },
        (err) => {
          // this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }

  checkAll(event: Event) {}

  stopParentEvent(event: Event) {
    event.stopPropagation();
  }

  addItemId(event: Event, id: any) {}

  viewObjectives(row: any) {
    this.router.navigate(["/manager/employee-appraisal"], {
      queryParams: {
        appraisalCycleId: row.appraisalCycleId,
        objectiveId: row.id,
        employeeId: row.employeeId,
        departmentId: row.departmentId,
        jobGradeId: row.jobGradeId,
        employeePerformId: row.employeePerformId,
      },
    });
  }
  viewAppraisal(row) {
    this.router.navigate(["/performance/appraisal-feedback-page"], {
      queryParams: {
        id: row.employeeId,
        appraisalCycleId: row.appraisalCycleId,
        employeePerformId: row.employeePerformId,
      },
    });
  }
}
