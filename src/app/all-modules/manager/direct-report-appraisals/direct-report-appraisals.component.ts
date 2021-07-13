import { Component, OnInit } from "@angular/core";
import { JwtService } from "src/app/services/jwt.service";
import { ManagerService } from "src/app/services/manager.service";
import swal from "sweetalert2";
import { Subject } from "rxjs";
import { LoadingService } from "../../../services/loading.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-direct-report-appraisals",
  templateUrl: "./direct-report-appraisals.component.html",
  styleUrls: ["./direct-report-appraisals.component.css"],
})
export class DirectReportAppraisalsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public selectedId: number[] = [];
  public reportAppraisals: any[] = [];
  user: any;
  dtTrigger: Subject<any> = new Subject<any>();
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
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [
        { orderable: false },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
    this.activities = this.jwtService.getUserActivities();
    this.user = this.jwtService.getUserDetails();
    if (this.activities.includes("line manager")) {
      // this.getAppraisalObjByManagerId(this.user.staffId);
    }
  }

  getAppraisalObjByManagerId() {
    this.loadingService.show();
    this.performanceManagementService
      .getEmployeeObjectivesByLineManager(this.employeeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.reportAppraisals = data;
          this.dtTrigger.next();
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
      },
    });
  }
  viewAppraisal(row) {
    this.router.navigate(["/performance/appraisal-feedback-page"], {
      queryParams: {
        id: row.employeeId,
        appraisalCycleId: row.appraisalCycleId,
      },
    });
  }
}
