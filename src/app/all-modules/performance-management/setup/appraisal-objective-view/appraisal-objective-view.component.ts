import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../../services/loading.service";
import { PerformanceManagementService } from "../../../../services/performance-management.service";
import { JwtService } from "../../../../services/jwt.service";

@Component({
  selector: "app-appraisal-objective-view",
  templateUrl: "./appraisal-objective-view.component.html",
  styleUrls: ["./appraisal-objective-view.component.css"],
})
export class AppraisalObjectiveViewComponent implements OnInit {
  employeeId: number;
  deptId: number;
  constructor(
    private loadingService: LoadingService,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    const user = this.jwtService.getUserDetails();
    this.employeeId = user.staffId;
    this.deptId = user.companyId;
    this.getEmployeeAppraisalCycle();
  }
  getEmployeeAppraisalCycle() {
    this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(this.employeeId, this.deptId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          console.log(data);
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
}
