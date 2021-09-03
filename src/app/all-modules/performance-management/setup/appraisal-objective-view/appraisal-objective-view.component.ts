import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../../services/loading.service";
import { PerformanceManagementService } from "../../../../services/performance-management.service";
import { JwtService } from "../../../../services/jwt.service";
import { Appraisal, IAppraisalCycle } from "../../../../interface/interfaces";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UtilitiesService } from "../../../../services/utilities.service";

@Component({
  selector: "app-appraisal-objective-view",
  templateUrl: "./appraisal-objective-view.component.html",
  styleUrls: ["./appraisal-objective-view.component.css"],
})
export class AppraisalObjectiveViewComponent implements OnInit {
  employeeId: number;
  deptId: number;
  jobGradeId: number;
  employeeAppraisalCycle: IAppraisalCycle[] = [];
  reviewYears$: Observable<any> = this.performanceManagementService.getReviewYears();
  activeIndex: number;
  constructor(
    private loadingService: LoadingService,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private router: Router,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.jwtService.getHrmUserDetails().then((employee) => {
      this.employeeId = employee.employeeId;
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
          this.employeeAppraisalCycle = data;
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
        employeePerformId: item.employeePerformId,
        objectiveId: item.id,
        jobgradeId: item.jobGradeId,
        status: item.status,
        start: true,
        // pageStatus: 1,
      },
    });
  }
  filter(value: any) {
    return this.performanceManagementService
      .filterObjectves(value)
      .subscribe((data) => {
        this.employeeAppraisalCycle = data;
      });
  }

  addObjective() {
    this.router.navigate(["/performance/appraisal-objective-form"], {
      queryParams: {
        start: true,
      },
    });
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
    console.log(this.activeIndex);
  }

  viewObjective(item) {
    const payload: Appraisal = {
      id: item.employeePerformId,
      employee: item.employeeId,
      appraisalCycleId: item.appraisalCycleId,
      department: item.departmentId,
      jobGradeId: item.jobGradeId,
    };
    return this.performanceManagementService.startAppraisal(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          this.router.navigate(["/performance/appraisal-objective-form"], {
            queryParams: {
              employeePerformId: item.employeePerformId,
              appraisalCycleId: item.appraisalCycleId,
            },
          });
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }
}
