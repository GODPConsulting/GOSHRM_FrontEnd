import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../../services/loading.service";
import { PerformanceManagementService } from "../../../../services/performance-management.service";
import { JwtService } from "../../../../services/jwt.service";
import { IAppraisalCycle } from "../../../../interface/interfaces";
import { Router } from "@angular/router";

@Component({
  selector: "app-appraisal-objective-view",
  templateUrl: "./appraisal-objective-view.component.html",
  styleUrls: ["./appraisal-objective-view.component.css"],
})
export class AppraisalObjectiveViewComponent implements OnInit {
  employeeId: number;
  deptId: number;
  jobGradeId: number;
  employeeAppraialCycle: IAppraisalCycle[] = [];
  constructor(
    private loadingService: LoadingService,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((employee) => {
      this.employeeId = employee.staffId;
      this.jobGradeId = employee.jobGrade;
      this.deptId = employee.companyId;
      this.getEmployeeAppraisalCycle();
    });
  }
  getEmployeeAppraisalCycle() {
    // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(this.employeeId, this.deptId, this.jobGradeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.employeeAppraialCycle = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  viewCycle(item: any) {
    this.router.navigate(["/performance/appraisal-objective-form"], {
      queryParams: {
        appraisalCycleId: item.appraisalCycleId,
        objectiveId: item.id,
        jobgradeId: item.jobGradeId,
      },
    });
  }
}
