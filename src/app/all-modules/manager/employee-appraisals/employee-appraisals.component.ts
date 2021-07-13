import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../../../services/data.service";
import { LoadingService } from "../../../services/loading.service";
import { JwtService } from "../../../services/jwt.service";
import { UtilitiesService } from "../../../services/utilities.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-employee-appraisals",
  templateUrl: "./employee-appraisals.component.html",
  styleUrls: ["./employee-appraisals.component.css"],
})
export class EmployeeAppraisalsComponent implements OnInit {
  appraisalObjectiveForm: FormGroup;
  reviewStatus: any[] = [];
  user: any;
  staffId: any;
  employeeAppraisalInfo: any = {};
  appraisalCycleId: number;
  deptId: number;
  jobGradeId: number;
  appraisalCycles: any[] = [];
  objectiveId: number;
  lineManagerId: number;
  employeeId: number;
  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private utilitiesService: UtilitiesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.employeeId = param.employeeId;
      this.appraisalCycleId = param.appraisalCycleId;
      this.objectiveId = param.objectiveId;
      this.jobGradeId = param.jobGradeId;
      this.deptId = param.departmentId;
      this.getCareer(this.employeeId);
    });
    this.initializeForm();
    this.getAppraisalCycle();
    this.getSingleEmployeeObjective();
  }

  initializeForm() {
    this.appraisalObjectiveForm = this.formbuilder.group({
      id: [0],
      reviewYear: [""],
      reviewPeriod: [""],
      employee: [""],
      lineManager: [""],
      jobGradeId: [""],
      firstReviewer: [""],
      secondReviewer: [""],
      thirdReviewer: [""],
      comment: [""],
      appraisalCycleId: [""],
      department: [""],
      staffName: [""],
      line_ManagerName: [""],
      first_Level_ReviewerName: [""],
      second_Level_ReviewerName: [""],
      third_Level_ReviewerName: [""],
      job_title: [""],
      job_Grade: [""],
    });
  }

  getAppraisalCycle() {
    // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(
        this.employeeId,
        this.deptId,
        this.jobGradeId,
        this.appraisalCycleId
      )
      .subscribe(
        (data) => {
          // // this.loadingService.hide();
          this.appraisalCycles = data;
        },
        (err) => {
          // // this.loadingService.hide();
        }
      );
  }

  getCareer(id) {
    // this.loadingService.show();
    return this.performanceManagementService.getCareerByStaffId(id).subscribe(
      (data) => {
        // // this.loadingService.hide();
        this.employeeAppraisalInfo = data.employeeList[0];
        this.appraisalObjectiveForm.patchValue({
          staffName: this.employeeAppraisalInfo.staffName,
          job_Grade: this.employeeAppraisalInfo.job_Grade,
          job_title: this.employeeAppraisalInfo.job_title,
          line_ManagerName: this.employeeAppraisalInfo.line_ManagerName,
          first_Level_ReviewerName: this.employeeAppraisalInfo
            .first_Level_ReviewerName,
          second_Level_ReviewerName: this.employeeAppraisalInfo
            .second_Level_ReviewerName,
          third_Level_ReviewerName: this.employeeAppraisalInfo
            .second_Level_ReviewerName,
          employee: this.employeeAppraisalInfo.staffId,
          lineManager: this.employeeAppraisalInfo.line_ManagerId,
          department: this.deptId,
          appraisalCycleId: this.appraisalCycleId,
          firstReviewer: this.employeeAppraisalInfo.first_Level_ReviewerId,
          secondReviewer: this.employeeAppraisalInfo.second_Level_ReviewerId,
          thirdReviewer: this.employeeAppraisalInfo.third_Level_ReviewerId,
          jobGradeId: this.employeeAppraisalInfo.job_GradeId,
        });
      },
      (err) => {
        // // this.loadingService.hide();
      }
    );
  }
  getSingleEmployeeObjective() {
    // this.loadingService.show();
    return this.performanceManagementService
      .getSingleEmployeeObjective(this.employeeId, this.appraisalCycleId)
      .subscribe(
        (data) => {
          // console.log(data);
          // this.loadingService.hide();
          this.lineManagerId = data[0].lineManger;
          this.objectiveId = data[0].id;
          // console.log(this.lineManagerId);
          this.appraisalObjectiveForm.patchValue({
            reviewYear: data[0].reviewYear,
            reviewPeriod: data[0].reviewPeriod,
          });
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }
  confirm() {
    // this.loadingService.show();
    return this.performanceManagementService
      .confirmByManager(this.objectiveId)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            return this.utilitiesService.showMessage(res, "success");
          } else {
            return this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          // this.loadingService.hide();
          return this.utilitiesService.showMessage(err, "error");
        }
      );
  }

  saveComment() {
    const formObj = this.appraisalObjectiveForm.value;
    const payload = {
      id: this.objectiveId,
      comment: formObj.comment,
    };
    // this.loadingService.show();
    return this.performanceManagementService.addComment(payload).subscribe(
      (res) => {
        // this.loadingService.hide();
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success");
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        // this.loadingService.hide();
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  revokeAndDisagree() {
    // this.loadingService.show();
    return this.performanceManagementService
      .revokeAndDisagree(+this.objectiveId)
      .subscribe(
        (res) => {
          // // this.loadingService.hide();
          if (res.status.isSuccessful) {
            return this.utilitiesService.showMessage(res, "success");
          } else {
            return this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          return this.utilitiesService.showMessage(err, "error");
          // // this.loadingService.hide();
        }
      );
  }
}
